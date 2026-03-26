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
        name: 'indexTitle',
        title: 'Index Title',
        type: 'string',
        description: 'This is the title displayed on the directors page header.',
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
        name: 'workMotionClips',
        title: 'Work Page — Motion (full-screen videos)',
        type: 'array',
        description: 'For the Work page: one full-viewport video per row with title and description in the corner strip.',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Title',
                type: 'string',
              },
              {
                name: 'description',
                title: 'Description',
                type: 'text',
                rows: 4,
              },
              {
                name: 'videoFile',
                title: 'Video file (MP4 or WebM)',
                type: 'file',
                options: {
                  accept: 'video/mp4,video/webm',
                },
              },
            ],
            preview: {
              select: { title: 'title', media: 'videoFile' },
              prepare({ title }) {
                return { title: title || 'Motion clip' };
              },
            },
          },
        ],
      },
      {
        name: 'workStillsBackgroundLogo',
        title: 'Work Page — Stills background mark',
        type: 'image',
        description:
          'Optional large logo fixed behind Stills content (viewport center). Add on the Work page; appears only in Stills mode.',
        fields: [
          {
            name: 'alt',
            title: 'Alt text',
            type: 'string',
            description: 'Describe the mark for accessibility (can be brief).',
          },
        ],
      },
      {
        name: 'workStills',
        title: 'Work Page — Stills (editorial)',
        type: 'array',
        description: 'Stills with layout and optional parallax strength for scroll effect.',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'layout',
                title: 'Layout',
                type: 'string',
                description:
                  'Pick this first: it sets how many images you can add (1–3). Tablet shows max 2 columns, desktop up to 3.',
                options: {
                  list: [
                    { title: 'Full bleed — 1 image', value: 'fullBleed' },
                    { title: 'Centered — 1 image', value: 'centered' },
                    {
                      title: '3 columns, 2 for images + text (Left aligned)',
                      value: 'twoColumn',
                    },
                    {
                      title: '2 columns for images + 1 row for text',
                      value: 'dualImageTextRow',
                    },
                    { title: 'Three column — up to 3 images + text', value: 'threeColumn' },
                  ],
                  layout: 'radio',
                },
                initialValue: 'twoColumn',
                validation: (Rule) => Rule.required(),
              },
              {
                name: 'images',
                title: 'Images',
                type: 'array',
                description: 'Number of slots is limited by Layout above.',
                of: [
                  {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                      {
                        name: 'alt',
                        title: 'Alt text',
                        type: 'string',
                      },
                      {
                        name: 'parallaxStrength',
                        title: 'Parallax strength (this image)',
                        type: 'number',
                        description:
                          'Optional. Overrides the block parallax so each image can scroll at a different rate (e.g. 20 vs 55).',
                        validation: (R) => R.min(0).max(120),
                      },
                    ],
                  },
                ],
                validation: (Rule) =>
                  Rule.custom((images, context) => {
                    const p = context.parent;
                    const layout = p?.layout || 'twoColumn';
                    const maxByLayout = {
                      fullBleed: 1,
                      centered: 1,
                      twoColumn: 2,
                      dualImageTextRow: 2,
                      threeColumn: 3,
                    };
                    const max = maxByLayout[layout] ?? 2;
                    const legacyOk = !!p?.image?.asset;
                    const n =
                      Array.isArray(images) && images.length > 0
                        ? images.length
                        : legacyOk
                          ? 1
                          : 0;
                    if (n === 0) return 'Add at least one image';
                    if (Array.isArray(images) && images.length > max) {
                      return `This layout allows at most ${max} image(s). Change layout or remove extras.`;
                    }
                    return true;
                  }),
              },
              {
                name: 'title',
                title: 'Title',
                type: 'string',
              },
              {
                name: 'description',
                title: 'Description',
                type: 'text',
                rows: 3,
              },
              {
                name: 'parallaxStrength',
                title: 'Parallax strength',
                type: 'number',
                description: 'How much images shift vs scroll (e.g. 15–60). Higher = more movement.',
                initialValue: 35,
                validation: (Rule) => Rule.min(0).max(120),
              },
              {
                name: 'image',
                title: 'Image (legacy)',
                type: 'image',
                description: 'Older entries only. Prefer Images above; this is hidden when Images has items.',
                options: { hotspot: true },
                hidden: ({ parent }) => (parent?.images?.length ?? 0) > 0,
                fields: [
                  {
                    name: 'alt',
                    title: 'Alt text',
                    type: 'string',
                  },
                ],
              },
            ],
            preview: {
              select: {
                title: 'title',
                imgs: 'images',
                legacy: 'image',
                layout: 'layout',
              },
              prepare({ title, imgs, legacy, layout }) {
                const media = imgs?.[0] || legacy;
                return {
                  title: title || 'Still',
                  subtitle: layout || 'twoColumn',
                  media,
                };
              },
            },
          },
        ],
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
