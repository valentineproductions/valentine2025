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
        name: 'directorsPageClip',
        title: 'Directors Page Clip',
        type: 'file',
        options: {
          accept: 'video/mp4,video/webm',
        },
        description: 'Short video clip (7–15 sec, MP4) for the Directors list page. When hovering this director\'s name, this clip plays as the full-bleed background. Leave empty to skip.',
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
                  /* String source ("name") does not resolve for slugs inside array objects; use parent. */
                  source: (doc, context) => {
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
                name: 'simianEmbedUrl',
                title: 'Simian embed URL',
                type: 'string',
                description:
                  'Paste only the iframe src URL (the string inside src="..."), not the HTML wrapper. Example: https://valentine.gosimian.com/share/v/…/false/… — the site turns on autoplay for Simian URLs automatically.',
              },
              {
                name: 'profileClip',
                title: 'Profile Clip',
                type: 'file',
                options: {
                  accept: 'video/mp4,video/webm',
                },
                description: 'Video clip (7–15 sec, MP4) for full-bleed background. Required for this to appear on the profile.',
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
        description: 'Projects shown on the director profile page. Each needs a profile clip. Used as fallback: directorsPageClip when empty.',
      },
      {
        name: 'categories',
        title: 'Categories',
        type: 'array',
        of: [{ type: 'string' }],
        validation: Rule => Rule.max(5).error('You can add a maximum of 5 categories'),
        description: 'Categories for this team member (e.g., Food/Beverage, Fashion, Lifestyle). Maximum of 5 categories',
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
