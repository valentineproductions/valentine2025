const vercelEnv = process.env.VERCEL_ENV;
const datasetOverride = (vercelEnv === "preview" || process.env.NODE_ENV === "development")
  ? "staging"
  : (process.env.NEXT_PUBLIC_SANITY_DATASET || "production");

const config = {
    
    // Use environment variables for projectId and dataset
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: datasetOverride,
    
    apiVersion: "2025-05-10", // Mothers's day
    useCdn: false,
}

// Live API higher costs.. 
export default config;
