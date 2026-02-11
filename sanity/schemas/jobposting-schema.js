import { LocationSelect, CommitmentSelect } from '../components/JobSelectors';

const jobPosting = {
  name: 'jobPosting',
  title: 'Job Posting',
  type: 'document',
  fields: [
    {
      name: 'positionTitle',
      title: 'Position Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'code', title: 'Code', type: 'string' },
      ],
      description: 'Select based on Careers Page locations',
      components: {
        input: LocationSelect
      }
    },
    {
      name: 'commitment',
      title: 'Commitment',
      type: 'string',
      description: 'Select based on Careers Page commitments',
      components: {
        input: CommitmentSelect
      }
    },
    {
      name: 'Listed',
      title: 'Listed',
      type: 'boolean',
      description: 'Controls public visibility of this job posting',
      initialValue: true,
    },
    {
      name: 'postedAt',
      title: 'Posted Date',
      type: 'datetime',
      description: 'Use for sorting jobs by newest first',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { 
        source: doc => `${doc.positionTitle || ''}-${doc?.location?.code || ''}`, 
        maxLength: 96 
      },
      description: 'Slug combines position and location code',
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Use H2 for section titles (e.g., JOB OVERVIEW, KEY RESPONSIBILITIES).',
    },
    {
      name: 'applyCtaLabel',
      title: 'Apply CTA Label',
      type: 'string',
      initialValue: 'Apply',
    },
  ],
  preview: {
    select: {
      title: 'positionTitle',
      slug: 'slug.current',
    },
    prepare(selection) {
      const { title, slug } = selection;
      return {
        title,
        subtitle: slug ? `/careers/${slug}` : 'No URL',
      };
    },
  },
};

export default jobPosting;
