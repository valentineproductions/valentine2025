import {defineConfig} from 'sanity'
import React from 'react';
import deskStructure from './sanity/deskStructure'
import schemas from './sanity/schemas'; //Barrel file

const singletonTypes = ['siteSettings'];
const singletonActions = new Set(['publish', 'discardChanges', 'restore']);
const vercelEnv = process.env.VERCEL_ENV;
const isPreview = vercelEnv === 'preview';
const isDev = process.env.NODE_ENV === 'development';
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pl746aq8';
const datasetFromEnv = process.env.NEXT_PUBLIC_SANITY_DATASET;
const datasetOverride = (isPreview || isDev) ? 'staging' : (datasetFromEnv || 'production');

const DatasetBadgeNavbar = (props) => {
    const dataset = datasetOverride;
    const isProd = dataset === 'production';
    const badgeStyle = {
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        top: 8,
        zIndex: 1000,
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.32px',
        background: '#2b2b2b',
        color: '#ffffff',
        opacity: 0.9,
        pointerEvents: 'none'
    };
    return React.createElement(
        React.Fragment,
        null,
        props.renderDefault ? props.renderDefault(props) : null,
        isProd ? null : React.createElement('div', { style: badgeStyle }, `ENV: ${dataset}`)
    );
};

const config = defineConfig({
    title: 'Valentine Studio',

    // Use environment variables for projectId and dataset
    projectId,
    dataset: datasetOverride,
    
    apiVersion: "2025-05-19",
    basePath: "/admin", 
  
    plugins: [deskStructure],
    document: {
        newDocumentOptions: (prev, { creationContext }) => {
            if (creationContext.type === 'global') {
                return prev.filter(
                    (templateItem) => !singletonTypes.includes(templateItem.templateId)
                );
            }

            return prev;
        },
        actions: (prev, context) =>
            singletonTypes.includes(context.schemaType)
                ? prev.filter(
                    ({ action }) => action && singletonActions.has(action)
                )
                : prev
    },
    studio: {
        components: {
            navbar: DatasetBadgeNavbar
        }
    },
    schema: {
        types: schemas
    },
})
export default config;
