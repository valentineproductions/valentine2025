import {defineConfig} from 'sanity'
// import {deskTool} from "sanity/desk"
import {structureTool} from 'sanity/structure'
// import project from './sanity/schemas/project-schema'; //old version before refactor
import schemas from './sanity/schemas'; //Barrel file
// import {visionTool} from '@sanity/vision'

const config = defineConfig({
    title: 'Valentine Studio',

    projectId: 'pl746aq8',
    dataset: 'production',
    apiVersion: "2025-05-19",
    basePath: "/admin", 
  
    plugins: [structureTool()],
    schema: {
        types: schemas
    },
})
export default config;
