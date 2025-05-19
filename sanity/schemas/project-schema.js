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