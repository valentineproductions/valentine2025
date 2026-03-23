const aboutPageV2 = {
  name: 'aboutPageV2',
  title: 'Information Page v2',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'infoFooter', title: 'Information Page Footer' },
  ],
  fields: [
    {
      name: 'showInNav',
      title: 'Show in Navigation',
      type: 'boolean',
      description: 'When off, the Information page will not appear in the main nav but will still be accessible via direct URL.',
      initialValue: true,
      group: 'content',
    },
    {
      name: 'title',
      title: 'Page Title',
      type: 'text',
      rows: 3,
      description: 'Multiline text; desktop respects line breaks, mobile collapses them.',
      group: 'content',
    },
    {
      name: 'pageDescription',
      title: 'Page Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text description; line breaks will be respected.',
      group: 'content',
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
      group: 'content',
    },
    {
      name: 'backgroundOpacity',
      title: 'Background Opacity',
      type: 'number',
      description: 'Opacity value between 0 and 1.',
      validation: Rule => Rule.min(0).max(1),
      initialValue: 0.2,
      group: 'content',
    },
    {
      name: 'partnersTitle',
      title: 'Partners Title',
      type: 'string',
      initialValue: 'Partner',
      group: 'content',
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
      group: 'content',
    },
    {
      name: 'contactInfoTitle',
      title: 'Contact Info Title',
      type: 'string',
      group: 'content',
    },
    {
      name: 'contactInfoItems',
      title: 'Contact Info Items',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich content items. Plain emails auto-linked to mailto on render.',
      group: 'content',
    },
    {
      name: 'moreInfoTitle',
      title: 'More Info Title',
      type: 'string',
      group: 'content',
    },
    {
      name: 'moreInfoItems',
      title: 'More Info Items',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich content items. Plain emails auto-linked to mailto on render.',
      group: 'content',
    },
    {
      name: 'globalSectionTitle',
      title: 'Global Section Title',
      type: 'string',
      group: 'infoFooter',
    },
    {
      name: 'globalSectionUSLocations',
      title: 'US Cities',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Rendered as-is; joined with “ / ”.',
      group: 'infoFooter',
    },
    {
      name: 'globalSectionInternationalLocations',
      title: 'International Cities',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Rendered as-is; joined with “ / ”.',
      group: 'infoFooter',
    },
    {
      name: 'infoFooterLinks',
      title: 'Information Footer Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'labelText', title: 'Label Text', type: 'string' },
            { name: 'linkUrl', title: 'Link (optional)', type: 'string' },
            { name: 'openNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false },
          ],
          preview: {
            select: { title: 'labelText', url: 'linkUrl' },
            prepare(selection) {
              const { title, url } = selection;
              return {
                title: title || '(Label)',
                subtitle: url ? url : 'No link',
              };
            },
          },
        },
      ],
      description: 'Footer labels separated by “ / ”. Links optional; choose new/current tab.',
      group: 'infoFooter',
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
