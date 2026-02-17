const aboutPageV2 = {
  name: 'aboutPageV2',
  title: 'Information Page v2',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
    },
    {
      name: 'pageDescription',
      title: 'Page Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text description; line breaks will be respected.',
    },
    {
      name: 'backgroundImage',
      title: 'Background V Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
      description: 'Large PNG “V” overlay for the whole page.',
    },
    {
      name: 'backgroundOpacity',
      title: 'Background Opacity',
      type: 'number',
      description: 'Opacity value between 0 and 1.',
      validation: Rule => Rule.min(0).max(1),
      initialValue: 0.2,
    },
    {
      name: 'partnersTitle',
      title: 'Partners Title',
      type: 'string',
      initialValue: 'Partner',
    },
    {
      name: 'partners',
      title: 'Partners',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            {
              name: 'logoImage',
              title: 'Logo Image (optional)',
              type: 'image',
              options: { hotspot: true },
              fields: [
                { name: 'alt', title: 'Alt Text', type: 'string' },
              ],
              description: 'Logo appears over white background.',
            },
          ],
          preview: {
            select: { title: 'name', media: 'logoImage' },
          },
        },
      ],
      description: 'List of partner names. Logos optional. Names rendered as “name1 / name2”.',
    },
    {
      name: 'contactInfoTitle',
      title: 'Contact Info Title',
      type: 'string',
    },
    {
      name: 'contactInfoItems',
      title: 'Contact Info Items',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich content items. Plain emails auto-linked to mailto on render.',
    },
    {
      name: 'moreInfoTitle',
      title: 'More Info Title',
      type: 'string',
    },
    {
      name: 'moreInfoItems',
      title: 'More Info Items',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich content items. Plain emails auto-linked to mailto on render.',
    },
    {
      name: 'globalSectionTitle',
      title: 'Global Section Title',
      type: 'string',
    },
    {
      name: 'globalSectionLocations',
      title: 'Global Section Locations',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Rendered as-is; joined with “ / ”.',
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const title = selection?.title || '';
      const words = title.trim().split(/\s+/).slice(0, 3).join(' ');
      return {
        title: words ? `${words}…` : 'Information Page v2',
      };
    },
  },
};

export default aboutPageV2;
