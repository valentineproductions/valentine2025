const teamMember = {
    name: 'teamMember', 
    title: 'Team Member', 
    type: 'document',
    fields: [
      {
        name: 'fullName',
        title: 'Full Name',
        type: 'string',
        description: 'The full name of the team member.',
      },
      {
        name: 'talentPosition',
        title: 'Talent Position',
        type: 'string',
        description: 'The role or position of the team member (e.g., Director, Photographer).',
      },
      {
        name: 'city',
        title: 'City',
        type: 'string',
        description: 'The city where the team member is based.',
      },
      {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: true, // Enables image hotspot and crop tools
        },
        fields: [
          {
            name: 'alt',
            title: 'Alt Text',
            type: 'string',
            description: 'Alternative text for accessibility.',
          },
        ],
        description: 'Image of the team member.',
      },
      // You can add more fields here, like social media links, etc.
    ],
    preview: {
      select: {
        title: 'fullName',
        subtitle: 'talentPosition',
        media: 'image',
      },
    },
  };
  
  export default teamMember;