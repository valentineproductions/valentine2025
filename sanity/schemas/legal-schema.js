const legal = {
  name: 'legal',
  title: 'Legal',
  type: 'document',
  fields: [
    {
      name: 'pageTitle',
      title: 'Header Title',
      type: 'string',
      description: 'Optional header title. If empty, Title is used.',
    },
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
    },
    {
      name: 'pageDescription',
      title: 'Header Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Short description under the title.',
    },
    {
      name: 'contactInfo',
      title: 'More Info',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Optional info line styled like Work/Talent.',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};

export default legal;
