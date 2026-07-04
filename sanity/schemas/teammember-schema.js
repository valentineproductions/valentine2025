import SafeVideoFileInput from '../components/SafeVideoFileInput';

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
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'fullName',
          maxLength: 96,
        },
        description: 'URL-friendly identifier for the team member page (e.g., /directors/john-doe).',
        validation: Rule => Rule.required(),
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
        description:
          'For internal use only at the moment. The city where the team member is based.',
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
        description:
          'For internal use only at the moment. Image of the team member.',
      },
      {
        name: 'bio',
        title: 'Bio',
        type: 'array',
        of: [
          {
            type: 'block',
          },
        ],
        description: 'Biography or description of the team member (rich text).',
      },
      {
        name: 'videos',
        title: 'Videos',
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
        description: 'Array of Simian video embeds for this team member.',
      },
      {
        name: 'directorsPageClipSimian',
        title: 'Directors Page Clip (Simian)',
        type: 'string',
        description:
          'Background clip for the Directors list (hover preview). In Simian → Media → open the video → Metadata, copy the .mp4 file name shown as FILE or PROXY NAME (e.g. Nike-x-Union-LA-Field-General-Colored_4K_mov.mp4). When set, Directors Page Clip (Upload) is not needed.',
      },
      {
        name: 'directorsPageClip',
        title: 'Directors Page Clip (Upload)',
        type: 'file',
        options: {
          accept: 'video/mp4,video/webm',
        },
        components: {
          input: SafeVideoFileInput,
        },
        description:
          'Optional upload for the same Directors list background clip. If the Simian field above is set, it is used first. Leave both empty to skip.',
      },
      {
        name: 'profileProjects',
        title: 'Profile Projects',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'name',
                title: 'Video Name',
                type: 'string',
                description: 'Name displayed below the director\'s name (e.g. project or video title).',
              },
              {
                name: 'slug',
                title: 'Project URL slug',
                type: 'slug',
                options: {
                  maxLength: 96,
                  disableArrayWarning: true,
                  /* String source ("name") does not resolve for slugs inside array objects; use parent. */
                  source: (_doc, context) => {
                    const name = context?.parent?.name;
                    return typeof name === 'string' ? name : '';
                  },
                  slugify: (input) =>
                    String(input || '')
                      .toLowerCase()
                      .trim()
                      .replace(/['"]/g, '')
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '')
                      .replace(/-+/g, '-')
                      .replace(/^-|-$/g, '')
                      .slice(0, 96),
                },
                description:
                  'Used in /directors/[director]/[project-slug]. Click Generate to fill from Video Name (e.g. Boxing Video Sample → boxing-video-sample), then edit if needed.',
              },
              {
                name: 'simianProxyFile',
                title: 'Simian file name or proxy file (.mp4)',
                type: 'string',
                description:
                  'In Simian → Media → open the video → Metadata. Copy the .mp4 file name shown as FILE or PROXY NAME (e.g. Nike-x-Union-LA-Field-General-Colored_4K_mov.mp4). When this is set, Profile Clip is not needed — the site uses this file for the profile reel and full-screen video.',
              },
              {
                name: 'profileClip',
                title: 'Profile Clip',
                type: 'file',
                options: {
                  accept: 'video/mp4,video/webm',
                },
                components: {
                  input: SafeVideoFileInput,
                },
                hidden: ({ parent }) => Boolean(String(parent?.simianProxyFile || '').trim()),
                description:
                  'Optional MP4/WebM upload — only if the Simian file name above is empty. Used for the profile reel and full-screen video.',
              },
            ],
            preview: {
              select: {
                title: 'name',
                slug: 'slug',
              },
              prepare({ title, slug }) {
                return {
                  title: title || 'Untitled',
                  subtitle: slug?.current ? `/${slug.current}` : undefined,
                };
              },
            },
          },
        ],
        description:
          'Projects on the director profile. Each row needs a Simian .mp4 file name or an uploaded Profile Clip. If none qualify, the Directors page clip is used as a single fallback reel.',
      },
      {
        name: 'categories',
        title: 'Categories',
        type: 'array',
        of: [{ type: 'string' }],
        validation: Rule => Rule.max(5).error('You can add a maximum of 5 categories'),
        description:
          'For internal use only at the moment. Categories for this team member (e.g., Food/Beverage, Fashion, Lifestyle). Maximum of 5 categories.',
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
