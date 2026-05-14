import { structureTool } from 'sanity/structure';

export const deskStructure = async (S, context) => {
  const client = context.getClient({ apiVersion: '2025-05-10' });

  const [
    allApplicationsCount,
    needsReviewCount,
    reviewedCount,
    responseSentCount,
    topRatedCount,
    jobsWithCounts,
  ] = await Promise.all([
    client.fetch('count(*[_type == "application"])'),
    client.fetch('count(*[_type == "application" && status == "Needs Review"])'),
    client.fetch('count(*[_type == "application" && status == "Reviewed"])'),
    client.fetch('count(*[_type == "application" && status == "Response Sent"])'),
    client.fetch('count(*[_type == "application" && defined(rating)])'),
    client.fetch(`
      *[_type == "jobPosting"] | order(positionTitle asc) {
        _id,
        positionTitle,
        "applicationsCount": count(*[_type == "application" && references(^._id)])
      }
    `),
  ]);

  const applicationsByJobItems = jobsWithCounts.map((job) =>
    S.listItem()
      .id(`job-applications-${job._id}`)
      .title(`${job.positionTitle || 'Untitled Job'} (${job.applicationsCount || 0})`)
      .child(
        S.documentTypeList('application')
          .title(`${job.positionTitle || 'Untitled Job'} Applications (${job.applicationsCount || 0})`)
          .filter('_type == "application" && references($jobId)')
          .params({ jobId: job._id })
      )
  );

  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),
      S.listItem()
        .title('Careers Data')
        .child(
          S.list()
            .title('Careers Data')
            .items([
              S.documentListItem().title('Careers Page').schemaType('careersPage'),
              S.documentTypeListItem('jobPosting').title('Job Opportunities Items'),
              S.listItem()
                .title(`All Applications (${allApplicationsCount})`)
                .child(
                  S.documentTypeList('application')
                    .title(`All Applications (${allApplicationsCount})`)
                ),
              S.listItem()
                .title(`Applications By Job Post (${allApplicationsCount})`)
                .child(
                  S.list()
                    .title('Applications By Job Post')
                    .items(applicationsByJobItems)
                ),
              S.listItem()
                .title(`Needs Review (${needsReviewCount})`)
                .child(
                  S.documentTypeList('application')
                    .title(`Needs Review (${needsReviewCount})`)
                    .filter('status == $status')
                    .params({ status: 'Needs Review' })
                ),
              S.listItem()
                .title(`Reviewed (${reviewedCount})`)
                .child(
                  S.documentTypeList('application')
                    .title(`Reviewed (${reviewedCount})`)
                    .filter('status == $status')
                    .params({ status: 'Reviewed' })
                ),
              S.listItem()
                .title(`Response Sent (${responseSentCount})`)
                .child(
                  S.documentTypeList('application')
                    .title(`Response Sent (${responseSentCount})`)
                    .filter('status == $status')
                    .params({ status: 'Response Sent' })
                ),
              S.listItem()
                .title(`Top Rated (${topRatedCount})`)
                .child(
                  S.documentTypeList('application')
                    .title(`Top Rated (${topRatedCount})`)
                    .filter('defined(rating)')
                    .defaultOrdering([{ field: 'rating', direction: 'desc' }])
                ),
            ])
        ),
      S.listItem()
        .title('Legal Pages')
        .child(
          S.documentTypeList('legal').title('Legal Pages')
        ),
      ...S.documentTypeListItems().filter(
        (item) => !['careersPage', 'jobPosting', 'application', 'legal', 'aboutPage', 'siteSettings'].includes(item.getId())
      ),
    ]);
};

export default structureTool({ structure: deskStructure });
