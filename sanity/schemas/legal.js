const legal = {
  name: 'legal',
  title: 'Legal Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'Unique path for this page (generated from Title).',
    },
    {
      name: 'titleDescription',
      title: 'Title Description',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'moreInfo',
      title: 'More Info',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text content of the legal page.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
};

export default legal;
