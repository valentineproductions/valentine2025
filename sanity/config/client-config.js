const config = {
    
    // Use environment variables for projectId and dataset
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    
    apiVersion: "2025-05-10", // Mothers's day
    useCdn: false,
}

// Live API higher costs.. 
export default config;