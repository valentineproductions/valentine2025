const pageNote = {
    name: 'pageNote',
    title: 'Page Notes',
    type: 'document',
    fields: [
      {
        name: 'workTitle',
        title: 'Work Title',
        type: 'string',
        description: 'Optional title for the "Work" related content.',
      },
      {
        name: 'workDescription',
        title: 'Work Description',
        type: 'text',
        description: 'Optional description for the "Work" related content.',
      },
      {
        name: 'connectTitle',
        title: 'Connect Title',
        type: 'string',
        description: 'Optional title for the "Connect" section.',
      },
      {
        name: 'connectLinks',
        title: 'Connect Links',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'linkTitle',
                title: 'Link Title',
                type: 'string',
                description: 'Title of the link (e.g., Instagram, Email).',
              },
              {
                name: 'linkUrl',
                title: 'Link URL',
                type: 'url',
                description: 'The URL for the link.',
              },
              {
                name: 'openNewTab',
                title: 'Open in New Tab',
                type: 'boolean',
                description: 'Check this box to open the link in a new tab.',
              },
            ],
            preview: {
              select: {
                title: 'linkTitle',
                subtitle: 'linkUrl',
              },
            },
          },
        ],
        description: 'Optional links for the "Connect" section (e.g., social media, contact).',
      },
      {
        name: 'aboutDepartment1',
        title: 'About Page - Department 1',
        type: 'string',
        description: 'Department for the sidebar and mobile footer of the About page',
      },
      {
        name: 'aboutEmailD1',
        title: 'About Page - Email for Department 1',
        type: 'string',
        description: 'Email address associated with Department 1 on the About page',
      },
      {
        name: 'aboutDepartment2',
        title: 'About Page - Department 2',
        type: 'string',
        description: 'Department for the second section in the sidebar and mobile footer of the About page',
      },
      {
        name: 'aboutEmailD2',
        title: 'About Page - Email for Department 2',
        type: 'string',
        description: 'Email address associated with Department 2 on the About page',
      },
      {
        name: 'aboutDepartment3',
        title: 'About Page - Department 3',
        type: 'string',
        description: 'Department for the third section in the sidebar and mobile footer of the About page',
      },
      {
        name: 'aboutEmailD3',
        title: 'About Page - Email for Department 3',
        type: 'string',
        description: 'Email address associated with Department 3 on the About page',
      },
      {
        name: 'copyrightText',
        title: 'Copyright Text',
        type: 'string',
        description: 'Optional copyright information.',
      },
      {
        name: 'copyrightYear',
        title: 'Copyright Year',
        type: 'string', // Or 'number'
        description: 'Optional year for copyright.',
      },
      {
        name: 'copyrightBrandName',
        title: 'Copyright Brand Name',
        type: 'string',
        description: 'Optional brand name for copyright.',
      },
    ],
    preview: {
      select: {
        title: 'copyrightBrandName',
        subtitle: 'copyrightYear',
      },
    },
  };
  
  export default pageNote;