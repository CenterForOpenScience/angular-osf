import { ApiData, JsonApiResponseWithPaging } from '@core/models';
import {
  Preprint,
  PreprintAttributesJsonApi,
  PreprintEmbedsJsonApi,
  PreprintRelationshipsJsonApi,
  PreprintShortInfoWithTotalCount,
} from '@osf/features/preprints/models';

export class PreprintsMapper {
  static toCreatePayload(title: string, abstract: string, providerId: string) {
    return {
      data: {
        attributes: {
          title: title,
          description: abstract,
        },
        relationships: {
          provider: {
            data: {
              id: providerId,
              type: 'preprint-provider',
            },
          },
        },
        type: 'preprints',
      },
    };
  }

  static fromPreprintJsonApi(
    response: ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, null>
  ): Preprint {
    return {
      id: response.id,
      dateCreated: response.attributes.date_created,
      dateModified: response.attributes.date_modified,
      title: response.attributes.title,
      description: response.attributes.description,
      doi: response.attributes.doi,
      customPublicationCitation: response.attributes.custom_publication_citation,
      originalPublicationDate: response.attributes.original_publication_date,
      isPublished: response.attributes.is_published,
      tags: response.attributes.tags,
      isPublic: response.attributes.public,
      version: response.attributes.version,
      isLatestVersion: response.attributes.is_latest_version,
      primaryFileId: response.relationships.primary_file?.data?.id || null,
      nodeId: response.relationships.node?.data?.id,
      licenseId: response.relationships.license?.data?.id || null,
      licenseOptions: response.attributes.license_record
        ? {
            year: response.attributes.license_record.year,
            copyrightHolders: response.attributes.license_record.copyright_holders.join(','),
          }
        : null,
      hasCoi: response.attributes.has_coi,
      coiStatement: response.attributes.conflict_of_interest_statement,
      hasDataLinks: response.attributes.has_data_links,
      dataLinks: response.attributes.data_links,
      whyNoData: response.attributes.why_no_data,
      hasPreregLinks: response.attributes.has_prereg_links,
      whyNoPrereg: response.attributes.why_no_prereg,
      preregLinks: response.attributes.prereg_links,
      preregLinkInfo: response.attributes.prereg_link_info,
    };
  }

  static toSubmitPreprintPayload(preprintId: string) {
    return {
      data: {
        type: 'review_actions',
        attributes: {
          trigger: 'submit',
        },
        relationships: {
          target: {
            data: {
              type: 'preprints',
              id: preprintId,
            },
          },
        },
      },
    };
  }

  static fromMyPreprintJsonApi(
    response: JsonApiResponseWithPaging<ApiData<PreprintAttributesJsonApi, PreprintEmbedsJsonApi, null, null>[], null>
  ): PreprintShortInfoWithTotalCount {
    return {
      data: response.data.map((preprintData) => {
        return {
          id: preprintData.id,
          title: preprintData.attributes.title,
          dateModified: preprintData.attributes.date_modified,
          contributors: preprintData.embeds.bibliographic_contributors.data.map((contrData) => {
            return {
              id: contrData.id,
              name: contrData.embeds.users.data.attributes.full_name,
            };
          }),
        };
      }),
      totalCount: response.links.meta.total,
    };
  }
}
