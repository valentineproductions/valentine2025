const homepage = {
  name: 'homepage',
  title: 'Home Pages',
  type: 'document',
  groups: [
    {
      name: 'hero',
      title: 'Hero Section',
    },
    {
      name: 'services',
      title: 'Services Section',
    },
    {
      name: 'process',
      title: 'Process Section',
    },
    {
      name: 'approach',
      title: 'Approach Section',
    },
    {
      name: 'general',
      title: 'General Information',
      default: true, // Make this the default group
    },
    {
      name: 'pageNoteGroup',
      title: 'Page Note & Footer',
    },
    {
      name: 'seo',
      title: 'SEO', // You might want an SEO group as well
    },
  ],
  fields: [
    // General Information Group
    {
      name: 'companyLogo',
      title: 'Company Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Company Logo Alt Text',
          type: 'string',
          description: 'Alternative text for the company logo.',
        },
      ],
      description: 'The logo of the company for the Home Navigation.',
      group: 'general',
    },
    {
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      description: 'The name of the company.',
      group: 'general',
    },
    {
      name: 'companyIcon',
      title: 'Company Icon',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'A smaller icon for the company, used in previews.',
      group: 'general',
    },
    // Page Note & Footer Group

    {
      name: 'locations',
      title: 'Locations',
      type: 'string',
      description: 'A list of locations to be displayed in the footer of home videos.',
      group: 'pageNoteGroup',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Contact email address.',
      group: 'pageNoteGroup',
    },
    {
      name: 'pageNote',
      title: 'Page Note',
      type: 'reference',
      to: { type: 'pageNote' },
      description: 'Page note to associate with this homepage.',
      validation: Rule => Rule.required(),
      group: 'pageNoteGroup',
    },
    {
      name: 'homeFrame',
      title: 'Home Frame Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Home Frame Alt',
          type: 'string',
          description: 'Alternative text for the home frame.',
        },
      ],
      description: 'home frame image.',
      group: 'pageNoteGroup',
    },
    // Hero Section Group
    {
      name: 'slogan',
      title: 'Slogan',
      type: 'string',
      description: 'The main slogan for the homepage.',
      group: 'hero',
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Optional background color for the homepage (e.g., #f0f0f0).',
      group: 'hero',
    },
    {
      name: 'homeVideo1',
      title: 'Home Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      description: 'The main background video for the homepage.',
      group: 'hero',
    },
    {
      name: 'videoAlt1',
      title: 'Video Alt Text',
      type: 'string',
      description: 'Alternative text for the video.',
      group: 'hero',
    },
    {
      name: 'videoDescription1',
      title: 'Video Description',
      type: 'text',
      description: 'Optional description for the video.',
      group: 'hero',
    },
    // Services Section Group
    {
      name: 'servicesTitle',
      title: 'Services Title',
      type: 'string',
      description: 'Title for the "Services" section.',
      group: 'services',
    },
    {
      name: 'osDescription',
      title: 'Services Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Description for the "Services" section.',
      group: 'services',
    },
    {
      name: 'servicesList',
      title: 'Services List',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'osTitle',
              title: 'Service Title',
              type: 'string',
              description: 'Title for a service category.',
            },
            {
              name: 'osItems',
              title: 'Service Items',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'List of services under this category.',
            },
          ],
          preview: {
            select: {
              title: 'osTitle',
              subtitle: 'osItems.0',
            },
          },
        },
      ],
      description: 'List of service categories with their items.',
      group: 'services',
    },
    // Process Section Group
    {
      name: 'processTitle',
      title: 'Process Title',
      type: 'string',
      description: 'Title for the "Process" section.',
      group: 'process',
    },
    {
      name: 'opTitle1',
      title: 'Process Step 1 Title',
      type: 'string',
      description: 'Title for the first process step.',
      group: 'process',
    },
    {
      name: 'opText1',
      title: 'Process Step 1 Text',
      type: 'text',
      description: 'Description for the first process step.',
      group: 'process',
    },
    {
      name: 'opTitle2',
      title: 'Process Step 2 Title',
      type: 'string',
      description: 'Title for the second process step.',
      group: 'process',
    },
    {
      name: 'opText2',
      title: 'Process Step 2 Text',
      type: 'text',
      description: 'Description for the second process step.',
      group: 'process',
    },
    {
      name: 'opTitle3',
      title: 'Process Step 3 Title',
      type: 'string',
      description: 'Title for the third process step.',
      group: 'process',
    },
    {
      name: 'opText3',
      title: 'Process Step 3 Text',
      type: 'text',
      description: 'Description for the third process step.',
      group: 'process',
    },
    {
      name: 'opTitle4',
      title: 'Process Step 4 Title',
      type: 'string',
      description: 'Title for the fourth process step.',
      group: 'process',
    },
    {
      name: 'opText4',
      title: 'Process Step 4 Text',
      type: 'text',
      description: 'Description for the fourth process step.',
      group: 'process',
    },
    // Approach Section Group
    {
      name: 'approachTitle',
      title: 'Approach Title',
      type: 'string',
      description: 'Title for the "Approach" section.',
      group: 'approach',
    },
    {
      name: 'aDescription',
      title: 'Approach Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Description for the "Approach" section.',
      group: 'approach',
    },
    // SEO Group (Example - Add more SEO fields as needed)
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Title for search engine results.',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      description: 'Description for search engine results.',
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Relevant keywords for search engines.',
      group: 'seo',
    },
  ],
  preview: {
    select: {
      title: 'companyName',
      media: 'companyIcon',
    },
  },
};

export default homepage;