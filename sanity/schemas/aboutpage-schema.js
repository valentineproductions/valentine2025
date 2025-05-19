const aboutPage = {
    name: 'aboutPage',
    title: 'About Pages',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Page Title',
        type: 'string',
        description: 'The main title of the About Page (for internal use).',
      },
      {
        name: 'status',
        title: 'Status',
        type: 'boolean',
        description:
          'If on, this about page will be rendered. Useful for switching between available about pages.',
      },
      {
        name: 'pageNote',
        title: 'Page Note',
        type: 'reference',
        to: { type: 'pageNote' },
        description: 'The page note to associate with this about page.',
        validation: Rule => Rule.required(),
      },
      // Philosophy Section
      {
        name: 'philosophyTitle',
        title: 'Philosophy Title',
        type: 'string',
        group: 'philosophy',
      },
      {
        name: 'philosophyDescription1',
        title: 'Philosophy Description 1',
        type: 'text',
        group: 'philosophy',
      },
      {
        name: 'philosophyImageCount',
        title: 'Number of Philosophy Project Images',
        type: 'string',
        options: {
          list: [
            { value: '2', title: '2 Images' },
            { value: '3', title: '3 Images' },
          ],
          layout: 'radio',
        },
        group: 'philosophy',
        description: 'Select either 2 Images or 3 Images to display from the referenced project.',
        validation: Rule => Rule.required(),
      },
      {
        name: 'philosophyProject',
        title: 'Philosophy Project Reference',
        type: 'reference',
        to: { type: 'project' },
        group: 'philosophy',
        description: 'Reference to a project to display images and info from.',
      },
      {
        name: 'philosophyDescription2',
        title: 'Philosophy Description 2',
        type: 'text',
        group: 'philosophy',
      },
      {
        name: 'philosophyFeaturedImage',
        title: 'Philosophy Featured Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        fields: [
          {
            name: 'alt',
            title: 'Alt Text',
            type: 'string',
            description: 'Alternative text for the featured image.',
          },
        ],
        group: 'philosophy',
      },
      {
        name: 'philosophyFeaturedImageSize',
        title: 'Philosophy Featured Image Size',
        type: 'string',
        options: {
          list: [
            { value: 'short', title: 'Short' },
            { value: 'tall', title: 'Tall' },
          ],
          layout: 'radio',
        },
        group: 'philosophy',
        description: 'Choose the display size of the featured image.',
      },
  
      // Story Section
      {
        name: 'storyTitle',
        title: 'Story Title',
        type: 'string',
        group: 'story',
      },
      {
        name: 'storyDescription1',
        title: 'Story Description 1',
        type: 'text',
        group: 'story',
      },
      {
        name: 'storyImageCount',
        title: 'Number of Story Project Images',
        type: 'string',
        options: {
          list: [
            { value: '2', title: '2 Images' },
            { value: '3', title: '3 Images' },
          ],
          layout: 'radio',
        },
        group: 'story',
        description: 'Select either 2 Images or 3 Images to display from the referenced project.',
        validation: Rule => Rule.required(),
      },
      {
        name: 'storyProject',
        title: 'Story Project Reference',
        type: 'reference',
        to: { type: 'project' },
        group: 'story',
        description: 'Reference to a project to display images and info from.',
      },
      {
        name: 'storyDescription2',
        title: 'Story Description 2',
        type: 'text',
        group: 'story',
      },
      {
        name: 'storyFeaturedImage',
        title: 'Story Featured Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        fields: [
          {
            name: 'alt',
            title: 'Alt Text',
            type: 'string',
            description: 'Alternative text for the featured image.',
          },
        ],
        group: 'story',
      },
      {
        name: 'storyFeaturedImageSize',
        title: 'Story Featured Image Size',
        type: 'string',
        options: {
          list: [
            { value: 'short', title: 'Short' },
            { value: 'tall', title: 'Tall' },
          ],
          layout: 'radio',
        },
        group: 'story',
        description: 'Choose the display size of the featured image.',
      },
  
      // Who We Are Section
      {
        name: 'whoTitle',
        title: 'Who We Are Title',
        type: 'string',
        group: 'who',
      },
      {
        name: 'whoDescription1',
        title: 'Who We Are Description 1',
        type: 'text',
        group: 'who',
      },
      {
        name: 'whoImageCount',
        title: 'Number of Who We Are Project Images',
        type: 'string',
        options: {
          list: [
            { value: '2', title: '2 Images' },
            { value: '3', title: '3 Images' },
          ],
          layout: 'radio',
        },
        group: 'who',
        description: 'Select either 2 Images or 3 Images to display from the referenced project.',
        validation: Rule => Rule.required(),
      },
      {
        name: 'whoProject',
        title: 'Who We Are Project Reference',
        type: 'reference',
        to: { type: 'project' },
        group: 'who',
        description: 'Reference to a project to display images and info from.',
      },
      {
        name: 'whoDescription2',
        title: 'Who We Are Description 2',
        type: 'text',
        group: 'who',
      },
      {
        name: 'whoFeaturedImage',
        title: 'Who We Are Featured Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        fields: [
          {
            name: 'alt',
            title: 'Alt Text',
            type: 'string',
            description: 'Alternative text for the featured image.',
          },
        ],
        group: 'who',
      },
      {
        name: 'whoFeaturedImageSize',
        title: 'Who We Are Featured Image Size',
        type: 'string',
        options: {
          list: [
            { value: 'short', title: 'Short' },
            { value: 'tall', title: 'Tall' },
          ],
          layout: 'radio',
        },
        group: 'who',
        description: 'Choose the display size of the featured image.',
      },
    ],
    groups: [
      {
        name: 'philosophy',
        title: 'Philosophy Section',
      },
      {
        name: 'story',
        title: 'Story Section',
      },
      {
        name: 'who',
        title: 'Who We Are Section',
      },
    ],
    preview: {
      select: {
        title: 'title',
      },
    },
  };
  
  export default aboutPage;