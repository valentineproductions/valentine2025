const careersPage = {
  name: 'careersPage',
  title: 'Careers Page',
  type: 'document',
  fields: [
    {
      name: 'showInNav',
      title: 'Show in Navigation',
      type: 'boolean',
      description: 'When off, the Careers page will not appear in the main nav but will still be accessible via direct URL.',
      initialValue: true,
    },
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Supports links and line breaks, second line should be a quote to get the proper style.',
    },
    {
      name: 'locations',
      title: 'Locations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'code', title: 'Slug/Code', type: 'string' },
          ],
        },
      ],
      description: 'e.g., Name “New York” and code “NYC”',
    },
    {
      name: 'commitments',
      title: 'Commitments',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g., Full-time, Part-time, Contract, Freelance',
    },
    {
      name: 'allOpeningsTitle',
      title: 'All Openings Title',
      type: 'string',
      initialValue: 'All Openings',
    },
    {
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      initialValue: "Thanks for your interest. We'll be in touch shortly.",
    },
    {
      name: 'showAllJobs',
      title: 'Show All Jobs',
      type: 'boolean',
      description: 'If on, all jobs will be displayed and Selected Jobs is ignored.',
      initialValue: false,
    },
    {
      name: 'selectedJobs',
      title: 'Selected Jobs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'jobPosting' }] }],
      description: 'Only selected jobs will be displayed on the site',
    },
  ],
  preview: {
    select: { title: 'title' },
  },
};

export default careersPage;
