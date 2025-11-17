const project = {
    name: 'project',
    title: 'Projects',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        description: 'The name of the project.',
      },
      {
        name: 'clientName',
        title: 'Client Name',
        type: 'string',
        description: 'The name of the client for this project.',
      },
      {
        name: 'projectYear',
        title: 'Project Year',
        type: 'string', 
        description: 'The year the project was completed or launched.',
      },
      {
        name: 'projectDescription',
        title: 'Project Description',
        type: 'text',
        description: 'Internal project description for team reference',
      },
      {
        name: 'projectImages',
        title: 'Project Images',
        type: 'array',
        of: [
          {
            type: 'image',
            options: {
              hotspot: true,
            },
            fields: [
              {
                name: 'alt',
                title: 'Alt Text',
                type: 'string',
              },
            ],
          },
        ],
        description: 'All images for the project (first image will be used as preview).',
      },
      {
        name: 'videos',
        title: 'Videos',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'embedCode',
                title: 'Simian Embed Code',
                type: 'text',
                description: 'Paste the Simian embed code here (iframe or embed HTML).',
              },
              {
                name: 'title',
                title: 'Video Title',
                type: 'string',
                description: 'Optional title for the video.',
              },
              {
                name: 'videoName',
                title: 'Video Name',
                type: 'string',
                description: 'Name of the video.',
              },
            ],
            preview: {
              select: {
                title: 'title',
                videoName: 'videoName',
                embed: 'embedCode',
              },
              prepare({ title, videoName, embed }) {
                return {
                  title: videoName || title || 'Untitled Video',
                  subtitle: embed ? embed.substring(0, 50) + '...' : 'No embed code',
                };
              },
            },
          },
        ],
        description: 'Array of Simian video embeds for this project.',
      },
    ],
    preview: {
      select: {
        title: 'name',
        subtitle: 'clientName',
        media: 'projectImages.0.asset',
      },
    },
  };
  
  export default project;