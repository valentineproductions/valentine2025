import { createClient } from 'next-sanity';

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const SOURCE_DATASET = process.env.SANITY_SOURCE_DATASET || 'staging';
const TARGET_DATASET = process.env.SANITY_TARGET_DATASET || 'production';
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const API_VERSION = process.env.SANITY_API_VERSION || '2025-05-10';
const TOKEN = process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN;

if (!PROJECT_ID) {
  console.error('Missing project ID. Set NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID.');
  process.exit(1);
}

if (APPLY && !TOKEN) {
  console.error('Missing write token. Set SANITY_API_TOKEN (or SANITY_WRITE_TOKEN) before --apply.');
  process.exit(1);
}

const makeClient = (dataset, withWrite = false) =>
  createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: API_VERSION,
    useCdn: false,
    token: withWrite ? TOKEN : TOKEN || undefined,
  });

const sourceClient = makeClient(SOURCE_DATASET, false);
const targetClient = makeClient(TARGET_DATASET, APPLY);

const WORK_PAGE_QUERY = `*[_type == "page" && slug.current == "work"][0]{
  ...
}`;

const PROJECTS_BY_IDS_QUERY = `*[_type == "project" && _id in $ids]{
  ...
}`;

const IMAGE_ASSET_QUERY = `*[_type == "sanity.imageAsset" && _id in $ids]{
  _id,
  url,
  originalFilename,
  mimeType
}`;

const FILE_ASSET_QUERY = `*[_type == "sanity.fileAsset" && _id in $ids]{
  _id,
  url,
  originalFilename,
  mimeType
}`;

const sanitizeDocument = (doc) => {
  const clone = structuredClone(doc);
  delete clone._rev;
  delete clone._updatedAt;
  delete clone._createdAt;
  return clone;
};

const collectRefsRecursive = (node, refs = new Set()) => {
  if (!node || typeof node !== 'object') return refs;
  if (node._ref && typeof node._ref === 'string') {
    refs.add(node._ref);
  }
  if (Array.isArray(node)) {
    for (const item of node) collectRefsRecursive(item, refs);
    return refs;
  }
  for (const value of Object.values(node)) {
    collectRefsRecursive(value, refs);
  }
  return refs;
};

const remapRefsRecursive = (node, refMap) => {
  if (!node || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map((item) => remapRefsRecursive(item, refMap));
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === '_ref' && typeof v === 'string' && refMap.has(v)) {
      out[k] = refMap.get(v);
    } else {
      out[k] = remapRefsRecursive(v, refMap);
    }
  }
  return out;
};

async function uploadMissingAssets(sourceAssets, existingTargetAssetIds, assetType) {
  const refMap = new Map();
  const missingAssets = sourceAssets.filter((a) => !existingTargetAssetIds.has(a._id));

  for (const asset of missingAssets) {
    if (!asset.url) {
      console.warn(`Skipping ${asset._id}: missing URL`);
      continue;
    }
    const res = await fetch(asset.url);
    if (!res.ok) {
      console.warn(`Failed to fetch ${asset._id}: ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const uploaded = await targetClient.assets.upload(assetType, buf, {
      filename: asset.originalFilename || `${asset._id}.${assetType === 'image' ? 'jpg' : 'bin'}`,
      contentType: asset.mimeType || undefined,
    });
    refMap.set(asset._id, uploaded._id);
  }

  return { refMap, uploadedCount: refMap.size, missingCount: missingAssets.length };
}

async function main() {
  console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}`);
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Source dataset: ${SOURCE_DATASET}`);
  console.log(`Target dataset: ${TARGET_DATASET}`);

  const sourceWork = await sourceClient.fetch(WORK_PAGE_QUERY);
  if (!sourceWork) {
    console.error('Source work page not found (slug: work).');
    process.exit(1);
  }

  const sourceProjectRefs = Array.isArray(sourceWork.projects) ? sourceWork.projects : [];
  const sourceProjectIds = sourceProjectRefs
    .map((r) => r?._ref)
    .filter((id) => typeof id === 'string' && id.length > 0);
  const sourceProjects = sourceProjectIds.length
    ? await sourceClient.fetch(PROJECTS_BY_IDS_QUERY, { ids: sourceProjectIds })
    : [];

  const docBundle = [sourceWork, ...sourceProjects];
  const allRefs = Array.from(collectRefsRecursive(docBundle));
  const imageRefs = allRefs.filter((id) => id.startsWith('image-'));
  const fileRefs = allRefs.filter((id) => id.startsWith('file-'));

  const [targetWork] = await Promise.all([
    targetClient.fetch(`*[_type == "page" && slug.current == "work"][0]{_id,_updatedAt}`)
  ]);

  const [sourceImageAssets, targetImageAssetIds, sourceFileAssets, targetFileAssetIds] = await Promise.all([
    imageRefs.length ? sourceClient.fetch(IMAGE_ASSET_QUERY, { ids: imageRefs }) : [],
    imageRefs.length ? targetClient.fetch(`*[_type == "sanity.imageAsset" && _id in $ids]._id`, { ids: imageRefs }) : [],
    fileRefs.length ? sourceClient.fetch(FILE_ASSET_QUERY, { ids: fileRefs }) : [],
    fileRefs.length ? targetClient.fetch(`*[_type == "sanity.fileAsset" && _id in $ids]._id`, { ids: fileRefs }) : [],
  ]);

  const targetImageSet = new Set(targetImageAssetIds);
  const targetFileSet = new Set(targetFileAssetIds);
  const missingImages = sourceImageAssets.filter((a) => !targetImageSet.has(a._id));
  const missingFiles = sourceFileAssets.filter((a) => !targetFileSet.has(a._id));

  console.log('\n=== Work content migration report ===');
  console.log(`Source work page id: ${sourceWork._id}`);
  console.log(`Source work page updatedAt: ${sourceWork._updatedAt}`);
  console.log(`Target work page updatedAt: ${targetWork?._updatedAt || '(missing)'}`);
  console.log(`Referenced projects in source: ${sourceProjects.length}`);
  console.log(`Total referenced image assets: ${imageRefs.length}`);
  console.log(`Missing image assets in target: ${missingImages.length}`);
  console.log(`Total referenced file assets: ${fileRefs.length}`);
  console.log(`Missing file assets in target: ${missingFiles.length}`);

  if (!APPLY) {
    console.log('\nDry run complete. Re-run with --apply to migrate work content.');
    return;
  }

  const imageUpload = await uploadMissingAssets(sourceImageAssets, targetImageSet, 'image');
  const fileUpload = await uploadMissingAssets(sourceFileAssets, targetFileSet, 'file');

  const refMap = new Map([...imageUpload.refMap, ...fileUpload.refMap]);
  const remappedDocs = docBundle.map((d) => sanitizeDocument(remapRefsRecursive(d, refMap)));

  let tx = targetClient.transaction();
  for (const doc of remappedDocs) {
    tx = tx.createOrReplace(doc);
  }
  await tx.commit({ visibility: 'sync' });

  const targetAfter = await targetClient.fetch(`*[_type == "page" && slug.current == "work"][0]{_id,_updatedAt}`);

  console.log('\nMigration complete.');
  console.log(`Uploaded image assets: ${imageUpload.uploadedCount}`);
  console.log(`Uploaded file assets: ${fileUpload.uploadedCount}`);
  console.log(`Documents upserted: ${remappedDocs.length} (work page + referenced projects)`);
  console.log(`Target work page updatedAt now: ${targetAfter?._updatedAt || '(missing)'}`);
}

main().catch((err) => {
  console.error('\nMigration failed:');
  console.error(err);
  process.exit(1);
});
