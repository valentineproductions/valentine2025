import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import clientConfig from '../../../../sanity/config/client-config';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const workLink = formData.get('workLink') || null;
    const jobSlug = formData.get('jobSlug');
    const locationCode = formData.get('locationCode');
    const resume = formData.get('resume');
    const cover = formData.get('cover');

    if (!name || !email || !resume) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const serverClient = createClient({
      ...clientConfig,
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    });

    // Find job by slug and location code and ensure it's listed
    const job = await serverClient.fetch(
      `*[_type == "jobPosting" && slug.current == $slug && location.code == $code][0]{ _id, Listed }`,
      { slug: jobSlug, code: locationCode }
    );
    if (!job || job.Listed === false) {
      return new NextResponse('Job is not listed', { status: 400 });
    }

    // Upload resume
    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    const resumeAsset = await serverClient.assets.upload('file', resumeBuffer, {
      filename: resume.name || 'resume',
      contentType: resume.type || 'application/octet-stream',
    });

    let coverAsset = null;
    if (cover && cover.size > 0 && typeof cover.arrayBuffer === 'function') {
      const coverBuffer = Buffer.from(await cover.arrayBuffer());
      coverAsset = await serverClient.assets.upload('file', coverBuffer, {
        filename: cover.name || 'cover-letter',
        contentType: cover.type || 'application/octet-stream',
      });
    }

    const doc = {
      _type: 'application',
      applicantName: name,
      email,
      workLink: workLink || undefined,
      resumeFile: { _type: 'file', asset: { _type: 'reference', _ref: resumeAsset._id } },
      coverLetterFile: coverAsset ? { _type: 'file', asset: { _type: 'reference', _ref: coverAsset._id } } : undefined,
      status: 'Needs Review',
      rating: undefined,
      job: job?._id
        ? { _type: 'reference', _ref: job._id }
        : undefined,
      locationCode,
      createdAt: new Date().toISOString(),
    };

    await serverClient.create(doc);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Apply Error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
