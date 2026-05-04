const WORK_STILLS_LAYOUT_LIST = [
  {
    title:
      'One full bleed image row then title and description below',
    value: 'fullBleed',
  },
  {
    title: 'Centered one image with title and description',
    value: 'centered',
  },
  {
    title:
      'One row two equal columns two images staggered then centered title and description below',
    value: 'twoColumn',
  },
  {
    title:
      'One row two equal columns two images aligned then centered title and description below',
    value: 'dualImageTextRow',
  },
  {
    title:
      'One row three equal columns three images aligned then centered title and description below',
    value: 'threeColumn',
  },
];

const WORK_STILLS_LAYOUT_LABEL = Object.fromEntries(
  WORK_STILLS_LAYOUT_LIST.map((item) => [item.value, item.title]),
);

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
        description: 'For the Work page: one full-viewport video per row with brand name and campaign title in the corner strip.',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Brand Name',
                type: 'string',
              },
              {
                name: 'videoFile',
                title: 'Video file (MP4 or WebM)',
                type: 'file',
                options: {
                  accept: 'video/mp4,video/webm',
                },
                description: 'Optional. Better to use the Simian MP4 / proxy file below.',
              },
              {
                name: 'simianEmbedUrl',
                title: 'Simian embed URL',
                type: 'string',
                description:
                  'Go to Simian > Media Library > Edit Media > Metadata and use the "PROXY FILE" from the first letter through .mp4. If there is no proxy, the regular file name also works.',
              },
              {
                name: 'talentPosition',
                title: 'Campaign Title',
                type: 'string',
                description: 'Shown on the right of the bottom strip.',
                placeholder: 'Campaign title',
                validation: (Rule) => Rule.required(),
              },
            ],
            preview: {
              select: { title: 'title', media: 'videoFile', talentPosition: 'talentPosition' },
              prepare({ title, talentPosition }) {
                return {
                  title: title || 'Motion clip',
                  subtitle: talentPosition ? String(talentPosition) : undefined,
                };
              },
            },
          },
        ],
      },
      {
        name: 'workStillsBackgroundLogo',
        title: 'Work page stills background mark',
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
        name: 'workStillsBackgroundColor',
        title: 'Work page stills background color',
        type: 'string',
        description:
          'Optional CSS/hex color for the Stills page background (e.g., #5F1B19). Leave empty to use the default.',
      },
      {
        name: 'workStills',
        title: 'Work page stills editorial',
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
                  list: WORK_STILLS_LAYOUT_LIST,
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
                        name: 'parallaxAdjust',
                        title: 'Parallax adjust vs block',
                        type: 'number',
                        description:
                          'Optional. Added to the block baseline (e.g. +25 = stronger drift, −15 = subtler). Leave empty so this image matches the block exactly. Same baseline on all images keeps them aligned; different adjusts create separation while scrolling.',
                        validation: (R) => R.min(-60).max(60),
                      },
                      {
                        name: 'parallaxStrength',
                        title: 'Parallax strength (legacy override)',
                        type: 'number',
                        description: 'Deprecated: use Parallax adjust vs block. If set (old entries), this absolute value is used instead of baseline + adjust.',
                        validation: (R) => R.min(0).max(120),
                        hidden: true,
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
                title: 'Parallax baseline (block)',
                type: 'number',
                description:
                  'Default drift for every image in this block. Per-image Parallax adjust adds or subtracts from this. Raise the baseline for stronger motion overall.',
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
                const key = layout || 'twoColumn';
                return {
                  title: title || 'Still',
                  subtitle: WORK_STILLS_LAYOUT_LABEL[key] || key,
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
