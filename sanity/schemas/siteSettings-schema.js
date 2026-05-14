const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'googleTagManagerId',
      title: 'Google Tag Manager ID',
      type: 'string',
      description: 'Enter the GTM container ID, for example GTM-XXXXXXX.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) {
            return true;
          }

          return /^GTM-[A-Z0-9]+$/i.test(value)
            ? true
            : 'Use a valid GTM container ID like GTM-XXXXXXX.';
        }),
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      };
    },
  },
};

export default siteSettings;
