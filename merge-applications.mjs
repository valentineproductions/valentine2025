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

const APP_QUERY = `*[_type == "application"]{
  ...,
  resumeFile{asset},
  coverLetterFile{asset}
}`;

const FILE_ASSET_QUERY = `*[_type == "sanity.fileAsset" && _id in $ids]{
  _id,
  url,
  originalFilename,
  mimeType
}`;

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const sanitizeDocument = (doc) => {
  const clone = structuredClone(doc);
  delete clone._rev;
  delete clone._updatedAt;
  delete clone._createdAt;
  return clone;
};

const getFileRefs = (appDoc) => {
  const refs = [];
  const resumeRef = appDoc?.resumeFile?.asset?._ref;
  const coverRef = appDoc?.coverLetterFile?.asset?._ref;
  if (resumeRef) refs.push(resumeRef);
  if (coverRef) refs.push(coverRef);
  return refs;
};

const replaceFileRefs = (appDoc, refMap) => {
  const next = structuredClone(appDoc);
  const resumeRef = next?.resumeFile?.asset?._ref;
  const coverRef = next?.coverLetterFile?.asset?._ref;

  if (resumeRef && refMap.has(resumeRef)) {
    next.resumeFile.asset._ref = refMap.get(resumeRef);
  }
  if (coverRef && refMap.has(coverRef)) {
    next.coverLetterFile.asset._ref = refMap.get(coverRef);
  }
  return next;
};

async function uploadMissingFileAssets(sourceAssets, existingTargetAssetIds) {
  const refMap = new Map();
  const missingAssets = sourceAssets.filter((a) => !existingTargetAssetIds.has(a._id));

  if (missingAssets.length === 0) return { refMap, uploadedCount: 0 };

  console.log(`Uploading ${missingAssets.length} missing file assets to ${TARGET_DATASET}...`);

  for (const asset of missingAssets) {
    if (!asset.url) {
      console.warn(`Skipping asset ${asset._id}: missing URL`);
      continue;
    }

    const res = await fetch(asset.url);
    if (!res.ok) {
      console.warn(`Failed to download asset ${asset._id}: ${res.status}`);
      continue;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await targetClient.assets.upload('file', buffer, {
      filename: asset.originalFilename || `${asset._id}.bin`,
      contentType: asset.mimeType || undefined,
    });

    refMap.set(asset._id, uploaded._id);
  }

  return { refMap, uploadedCount: refMap.size };
}

async function main() {
  console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}`);
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Source dataset: ${SOURCE_DATASET}`);
  console.log(`Target dataset: ${TARGET_DATASET}`);

  const [sourceApps, targetAppIds] = await Promise.all([
    sourceClient.fetch(APP_QUERY),
    targetClient.fetch(`*[_type == "application"]._id`),
  ]);

  const targetIdSet = new Set(targetAppIds);
  const sourceOnlyApps = sourceApps.filter((app) => !targetIdSet.has(app._id));
  const sourceOnlyIds = sourceOnlyApps.map((a) => a._id);

  const fileRefs = Array.from(new Set(sourceOnlyApps.flatMap(getFileRefs)));

  const [sourceFileAssets, targetFileAssetIds] = fileRefs.length
    ? await Promise.all([
        sourceClient.fetch(FILE_ASSET_QUERY, { ids: fileRefs }),
        targetClient.fetch(`*[_type == "sanity.fileAsset" && _id in $ids]._id`, { ids: fileRefs }),
      ])
    : [[], []];

  const targetFileAssetIdSet = new Set(targetFileAssetIds);
  const missingFileAssets = sourceFileAssets.filter((a) => !targetFileAssetIdSet.has(a._id));

  console.log('\n=== Merge report ===');
  console.log(`Source applications: ${sourceApps.length}`);
  console.log(`Target applications: ${targetAppIds.length}`);
  console.log(`Applications missing in target: ${sourceOnlyApps.length}`);
  console.log(`Referenced file assets from missing apps: ${fileRefs.length}`);
  console.log(`Missing file assets in target: ${missingFileAssets.length}`);

  if (sourceOnlyIds.length > 0) {
    console.log('\nSample missing application IDs:');
    for (const id of sourceOnlyIds.slice(0, 15)) console.log(`- ${id}`);
    if (sourceOnlyIds.length > 15) console.log(`... and ${sourceOnlyIds.length - 15} more`);
  }

  if (!APPLY) {
    console.log('\nDry run complete. Re-run with --apply to merge.');
    return;
  }

  if (sourceOnlyApps.length === 0) {
    console.log('\nNo missing applications to merge. Nothing to do.');
    return;
  }

  const { refMap, uploadedCount } = await uploadMissingFileAssets(sourceFileAssets, targetFileAssetIdSet);
  console.log(`Uploaded file assets: ${uploadedCount}`);

  const docsToCreate = sourceOnlyApps
    .map((app) => replaceFileRefs(app, refMap))
    .map(sanitizeDocument);

  let createdCount = 0;
  for (const batch of chunk(docsToCreate, 50)) {
    let tx = targetClient.transaction();
    for (const doc of batch) {
      tx = tx.createIfNotExists(doc);
    }
    await tx.commit({ visibility: 'sync' });
    createdCount += batch.length;
    console.log(`Created ${createdCount}/${docsToCreate.length} applications...`);
  }

  const finalTargetCount = await targetClient.fetch(`count(*[_type == "application"])`);
  console.log('\nMerge complete.');
  console.log(`Applications created: ${createdCount}`);
  console.log(`Target application count now: ${finalTargetCount}`);
}

main().catch((err) => {
  console.error('\nMerge failed:');
  console.error(err);
  process.exit(1);
});
