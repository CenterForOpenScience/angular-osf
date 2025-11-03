import { StringOrNull } from '@osf/shared/helpers/types.helper';
import { IdentifiersMapper } from '@osf/shared/mappers/identifiers.mapper';
import { LicensesMapper } from '@osf/shared/mappers/licenses.mapper';
import { ApiData, JsonApiResponseWithMeta, ResponseJsonApi } from '@osf/shared/models/common/json-api.model';

import {
  PreprintAttributesJsonApi,
  PreprintEmbedsJsonApi,
  PreprintLinksJsonApi,
  PreprintMetaJsonApi,
  PreprintModel,
  PreprintRelationshipsJsonApi,
  PreprintShortInfoWithTotalCount,
} from '../models';

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
    response: ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, PreprintLinksJsonApi>
  ): PreprintModel {
    return {
      id: response.id,
      dateCreated: response.attributes.date_created,
      dateModified: response.attributes.date_modified,
      dateWithdrawn: response.attributes.date_withdrawn,
      datePublished: response.attributes.date_published,
      dateLastTransitioned: response.attributes.date_last_transitioned,
      title: response.attributes.title,
      description: response.attributes.description,
      reviewsState: response.attributes.reviews_state,
      preprintDoiCreated: response.attributes.preprint_doi_created,
      currentUserPermissions: response.attributes.current_user_permissions,
      doi: response.attributes.doi,
      customPublicationCitation: response.attributes.custom_publication_citation,
      originalPublicationDate: response.attributes.original_publication_date,
      isPublished: response.attributes.is_published,
      tags: response.attributes.tags,
      withdrawalJustification: response.attributes.withdrawal_justification,
      isPublic: response.attributes.public,
      version: response.attributes.version,
      isLatestVersion: response.attributes.is_latest_version,
      isPreprintOrphan: response.attributes.is_preprint_orphan,
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
      preprintDoiLink: response.links.preprint_doi,
      articleDoiLink: response.links.doi,
      embeddedLicense: null,
      providerId: response.relationships?.provider?.data?.id,
    };
  }

  static fromPreprintWithEmbedsJsonApi(
    response: JsonApiResponseWithMeta<
      ApiData<PreprintAttributesJsonApi, PreprintEmbedsJsonApi, PreprintRelationshipsJsonApi, PreprintLinksJsonApi>,
      PreprintMetaJsonApi,
      null
    >
  ): PreprintModel {
    const data = response.data;
    const links = response.data.links;
    const relationships = response?.data?.relationships;

    return {
      id: data.id,
      dateCreated: data.attributes.date_created,
      dateModified: data.attributes.date_modified,
      dateWithdrawn: data.attributes.date_withdrawn,
      datePublished: data.attributes.date_published,
      dateLastTransitioned: data.attributes.date_last_transitioned,
      title: data.attributes.title,
      description: data.attributes.description,
      reviewsState: data.attributes.reviews_state,
      preprintDoiCreated: data.attributes.preprint_doi_created,
      currentUserPermissions: data.attributes.current_user_permissions,
      doi: data.attributes.doi,
      customPublicationCitation: data.attributes.custom_publication_citation,
      originalPublicationDate: data.attributes.original_publication_date,
      isPublished: data.attributes.is_published,
      withdrawalJustification: data.attributes.withdrawal_justification,
      tags: data.attributes.tags,
      isPublic: data.attributes.public,
      version: data.attributes.version,
      isLatestVersion: data.attributes.is_latest_version,
      isPreprintOrphan: data.attributes.is_preprint_orphan,
      primaryFileId: data.relationships.primary_file?.data?.id || null,
      nodeId: data.relationships.node?.data?.id,
      licenseId: data.relationships.license?.data?.id || null,
      licenseOptions: data.attributes.license_record
        ? {
            year: data.attributes.license_record.year,
            copyrightHolders: data.attributes.license_record.copyright_holders.join(','),
          }
        : null,
      hasCoi: data.attributes.has_coi,
      coiStatement: data.attributes.conflict_of_interest_statement,
      hasDataLinks: data.attributes.has_data_links,
      dataLinks: data.attributes.data_links,
      whyNoData: data.attributes.why_no_data,
      hasPreregLinks: data.attributes.has_prereg_links,
      whyNoPrereg: data.attributes.why_no_prereg,
      preregLinks: data.attributes.prereg_links,
      preregLinkInfo: data.attributes.prereg_link_info,
      embeddedLicense: LicensesMapper.fromLicenseDataJsonApi(data.embeds?.license?.data),
      identifiers: IdentifiersMapper.fromJsonApi(data.embeds?.identifiers),
      preprintDoiLink: links.preprint_doi,
      articleDoiLink: links.doi,
      providerId: relationships?.provider?.data?.id,
    };
  }

  static toReviewActionPayload(preprintId: string, trigger: string, comment?: StringOrNull) {
    return {
      data: {
        type: 'review_actions',
        attributes: {
          trigger,
          ...(comment && { comment }),
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
    response: ResponseJsonApi<
      ApiData<PreprintAttributesJsonApi, PreprintEmbedsJsonApi, PreprintRelationshipsJsonApi, null>[]
    >
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
          providerId: preprintData.relationships.provider.data.id,
        };
      }),
      totalCount: response.meta.total,
    };
  }
}
