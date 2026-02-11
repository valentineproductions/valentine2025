import { structureTool } from 'sanity/structure';

export const deskStructure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Careers Data')
        .child(
          S.list()
            .title('Careers Data')
            .items([
              S.documentListItem().title('Careers Page').schemaType('careersPage'),
              S.documentTypeListItem('jobPosting').title('Job Opportunities Items'),
              S.listItem()
                .title('All Applications')
                .child(S.documentTypeList('application').title('All Applications')),
              S.listItem()
                .title('Applications By Job Post')
                .child(
                  S.documentTypeList('jobPosting')
                    .title('Job Postings')
                    .child(jobId =>
                      S.documentTypeList('application')
                        .title('Applications')
                        .filter('_type == "application" && references($jobId)')
                        .params({ jobId })
                    )
                ),
              S.listItem()
                .title('Needs Review')
                .child(
                  S.documentTypeList('application')
                    .title('Needs Review')
                    .filter('status == $status')
                    .params({ status: 'Needs Review' })
                ),
              S.listItem()
                .title('Reviewed')
                .child(
                  S.documentTypeList('application')
                    .title('Reviewed')
                    .filter('status == $status')
                    .params({ status: 'Reviewed' })
                ),
              S.listItem()
                .title('Response Sent')
                .child(
                  S.documentTypeList('application')
                    .title('Response Sent')
                    .filter('status == $status')
                    .params({ status: 'Response Sent' })
                ),
              S.listItem()
                .title('Top Rated')
                .child(
                  S.documentTypeList('application')
                    .title('Top Rated')
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
        (item) => !['careersPage', 'jobPosting', 'application', 'legal'].includes(item.getId())
      ),
    ]);

export default structureTool({ structure: deskStructure });
