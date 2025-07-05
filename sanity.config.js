import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import schemas from './sanity/schemas'; //Barrel file

const config = defineConfig({
    title: 'Valentine Studio',

    // Use environment variables for projectId and dataset
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    
    apiVersion: "2025-05-19",
    basePath: "/admin", 
  
    plugins: [structureTool()],
    schema: {
        types: schemas
    },
})
export default config;