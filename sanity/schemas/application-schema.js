import RatingSlider from '../components/RatingSlider';

const application = {
  name: 'application',
  title: 'Application',
  type: 'document',
  fields: [
    { name: 'applicantName', title: 'Applicant Name', type: 'string', validation: Rule => Rule.required() },
    { name: 'email', title: 'Email Address', type: 'string', validation: Rule => Rule.required().email() },
    { name: 'workLink', title: 'Link to Work', type: 'url' },
    {
      name: 'resumeFile',
      title: 'Resume',
      type: 'file',
      options: { accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      validation: Rule => Rule.required(),
    },
    {
      name: 'coverLetterFile',
      title: 'Cover Letter',
      type: 'file',
      options: { accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    },
    {
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 4,
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: '0–5 stars (step 0.5)',
      validation: Rule => Rule.min(0).max(5),
      components: {
        input: RatingSlider
      }
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Needs Review', value: 'Needs Review' },
          { title: 'Reviewed', value: 'Reviewed' },
          { title: 'Response Sent', value: 'Response Sent' },
        ],
        layout: 'radio',
      },
      initialValue: 'Needs Review',
    },
    {
      name: 'job',
      title: 'Job Posting',
      type: 'reference',
      to: [{ type: 'jobPosting' }],
    },
    { name: 'locationCode', title: 'Location Code', type: 'string' },
    { name: 'createdAt', title: 'Created At', type: 'datetime', initialValue: () => new Date().toISOString() },
  ],
  preview: {
    select: { title: 'applicantName', status: 'status', job: 'job.positionTitle' },
    prepare({ title, status, job }) {
      return { title, subtitle: `${status || 'Needs Review'} • ${job || 'Unknown Job'}` };
    },
  },
};

export default application;
