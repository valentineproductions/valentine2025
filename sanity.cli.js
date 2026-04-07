import { defineCliConfig } from 'sanity/cli';

const vercelEnv = process.env.VERCEL_ENV;
const isPreview = vercelEnv === 'preview';
const isDev = process.env.NODE_ENV === 'development';
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pl746aq8';
const datasetFromEnv = process.env.NEXT_PUBLIC_SANITY_DATASET;
const dataset = (isPreview || isDev) ? 'staging' : (datasetFromEnv || 'production');

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});