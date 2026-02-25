import ArrayWithCounter from '../components/ArrayWithCounter';
import LogoSizeSlider from '../components/LogoSizeSlider';

const project = {
    name: 'project',
    title: 'Projects',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        description: 'The name of the project.',
      },
      {
        name: 'clientName',
        title: 'Client Name',
        type: 'string',
        description: 'The name of the client for this project.',
      },
      {
        name: 'projectYear',
        title: 'Project Year',
        type: 'string', 
        description: 'The year the project was completed or launched.',
      },
      {
        name: 'projectDescription',
        title: 'Project Description',
        type: 'text',
        description: 'Internal project description for team reference',
      },
      {
        name: 'projectImages',
        title: 'Project Images',
        type: 'array',
        of: [
          {
            type: 'image',
            options: {
              hotspot: true,
            },
            fields: [
              {
                name: 'alt',
                title: 'Alt Text',
                type: 'string',
              },
            ],
          },
        ],
        description: 'First image will be used as preview. Total # images.',
        components: {
          field: ArrayWithCounter
        }
      },
      {
        name: 'videos',
        title: 'Project Videos',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'embedCode',
                title: 'Simian Embed Code',
                type: 'text',
                description: 'Paste the Simian embed code here (iframe or embed HTML).',
              },
              {
                name: 'videoName',
                title: 'Video Name',
                type: 'string',
                description: 'Name of the video.',
              },
              {
                name: 'coverImage',
                title: 'Custom Cover Image',
                type: 'image',
                description: 'Custom thumbnail/cover image for the video. //1920x1080.',
                options: {
                  hotspot: true,
                },
                fields: [
                  {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                  },
                ],
              },
              {
                name: 'logo',
                title: 'Logo Overlay',
                type: 'image',
                description: 'Logo to overlay on the cover image.',
                options: {
                  hotspot: true,
                },
                fields: [
                  {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                  },
                  {
                    name: 'sizePercent',
                    title: 'Logo Size (%)',
                    type: 'number',
                    description: 'Size of logo 20% to 100% //33% is default',
                    initialValue: 33,
                    validation: Rule => Rule.min(20).max(100),
                    components: {
                      input: LogoSizeSlider,
                    },
                  },
                ],
              },
            ],
            preview: {
              select: {
                videoName: 'videoName',
                embed: 'embedCode',
              },
              prepare({ videoName, embed }) {
                return {
                  title: videoName || 'Untitled Video',
                  subtitle: embed ? embed.substring(0, 50) + '...' : 'No embed code',
                };
              },
            },
          },
        ],
        description: 'Array of Simian video embeds with preview and logo optional each video. Total # videos',
        components: {
          field: ArrayWithCounter
        }
      },
    ],
    preview: {
      select: {
        title: 'name',
        subtitle: 'clientName',
        media: 'projectImages.0.asset',
      },
    },
  };
  
  export default project;