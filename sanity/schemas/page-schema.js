const page = {
    name: 'page',
    title: 'Pages',
    type: 'document',
    fields: [
      {
        name: 'pageCompanyLogo',
        title: 'Pages Company Logo',
        type: 'image',
        fields: [
          {
            name: 'alt',
            title: 'Company Logo Alt Text',
            type: 'string',
            description: 'Alternative text for the company logo of the pages.',
          },
        ],
        description: 'The logo of the company for the pages.',
        validation: Rule => Rule.required(),
      },
      {
        name: 'pageCompanyLogoWhite',
        title: 'Pages Company Logo White',
        type: 'image',
        fields: [
          {
            name: 'alt',
            title: 'Company Logo Alt Text',
            type: 'string',
            description: 'Alternative text for the company logo of the pages.',
          },
        ],
        description: 'The logo of the company for the pages.',
        validation: Rule => Rule.required(),
      },
      {
        name: 'navTitle',
        title: 'Navigation Title',
        type: 'string',
        description: 'This is the title of the navigation.',
      },
      {
        name: 'pageTitle',
        title: 'Page Title',
        type: 'string',
        description: 'This is the title of the page.',
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'navTitle',
          maxLength: 96,
        },
        description: 'A unique identifier for this page (auto-generated from Navigation Title).',
      },
      {
        name: 'pageDescription',
        title: 'Page Description',
        type: 'array',
        of: [{ type: 'block' }],
        description: 'Page Description.',
      },
      {
        name: 'contactInfo',
        title: 'Contact Info',
        type: 'array',
        of: [{ type: 'block' }],
        description: 'Optional contact information for this page (supports rich text).',
      },
      {
        name: 'tbd',
        title: 'Coming Soon Text',
        type: 'string',
        description: `
          Special patterns:
          • "Text.:" → Adds .: then removes both
          • "Text.." → Adds .. then removes both
          • "Text..." → Adds ... (stays)
          • "Text...." → Adds ... then removes all
          • "Text....." → Adds .... then keeps ...
          Empty shows "TBD"
        `,
        initialValue: 'Coming Soon'
      },
      {
        name: 'teamMembers',
        title: 'Team Members',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'teamMember' }] }],
        description: 'Optional team members to showcase on this page.',
      },
      {
        name: 'projects',
        title: 'Projects',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'project' }] }],
        description: 'Optional projects to showcase on this page.',
      },
      {
        name: 'pageNote',
        title: 'Page Note',
        type: 'reference',
        to: { type: 'pageNote' },
        description: 'Optional page note to associate with this page to work as a footer.',
      },
    ],
    preview: {
      select: {
        title: 'navTitle', 
        slug: 'slug.current',
      },
      prepare(selection) {
        const { title, slug } = selection;
        return {
          title: title,
          subtitle: slug ? `/${slug}` : 'No Slug',
        };
      },
    },
  };
  
  export default page;