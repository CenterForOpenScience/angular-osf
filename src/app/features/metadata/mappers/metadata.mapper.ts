import { ContributorsMapper, InstitutionsMapper, LicensesMapper } from '@osf/shared/mappers';

import { CustomItemMetadataRecord, CustomMetadataJsonApi, Metadata, MetadataJsonApi } from '../models';

export class MetadataMapper {
  static fromMetadataApiResponse(response: MetadataJsonApi): Metadata {
    console.log('MetadataMapper data', response);
    return {
      id: response.id,
      title: response.attributes.title,
      description: response.attributes.description,
      tags: response.attributes.tags,
      dateCreated: response.attributes.date_created,
      dateModified: response.attributes.date_modified,
      contributors: ContributorsMapper.fromResponse(response.embeds.bibliographic_contributors.data),
      license: LicensesMapper.fromLicenseDataJsonApi(response.embeds.license?.data),
      nodeLicense: response.attributes.node_license
        ? {
            copyrightHolders: response.attributes.node_license.copyright_holders || [],
            year: response.attributes.node_license.year || '',
          }
        : undefined,
      identifiers: response.embeds.identifiers.data.map((identifier) => ({
        id: identifier.id,
        type: identifier.type,
        category: identifier.attributes.category,
        value: identifier.attributes.value,
      })),
      affiliatedInstitutions: InstitutionsMapper.fromInstitutionsResponse(response.embeds.affiliated_institutions),
      provider: response.embeds.provider?.data.id,
    };
  }

  static fromCustomMetadataApiResponse(response: CustomMetadataJsonApi): Partial<CustomItemMetadataRecord> {
    return {
      language: response.attributes.language,
      resourceTypeGeneral: response.attributes.resource_type_general,
      funders: response.attributes.funders?.map((funder) => ({
        funderName: funder.funder_name,
        funderIdentifier: funder.funder_identifier,
        funderIdentifierType: funder.funder_identifier_type,
        awardNumber: funder.award_number,
        awardUri: funder.award_uri,
        awardTitle: funder.award_title,
      })),
    };
  }

  static toCustomMetadataApiRequest(id: string, metadata: Partial<CustomItemMetadataRecord>) {
    console.log('toCustomMetadataApiRequest', { id, metadata });
    return {
      data: {
        type: 'custom-item-metadata-records',
        id,
        attributes: {
          language: metadata.language,
          resource_type_general: metadata.resourceTypeGeneral,
          funders: metadata.funders?.map((funder) => ({
            funder_name: funder.funderName,
            funder_identifier: funder.funderIdentifier,
            funder_identifier_type: funder.funderIdentifierType,
            award_number: funder.awardNumber,
            award_uri: funder.awardUri,
            award_title: funder.awardTitle,
          })),
        },
      },
    };
  }

  // static fromMetadataApiResponse(response: Record<string, unknown>): ProjectOverview {
  //   const attributes = response['attributes'] as Record<string, unknown>;
  //   const embeds = response['embeds'] as Record<string, unknown>;

  //   const contributors: ProjectOverviewContributor[] = [];
  //   if (embeds['contributors']) {
  //     const contributorsData = (embeds['contributors'] as Record<string, unknown>)['data'] as Record<string, unknown>[];
  //     contributorsData?.forEach((contributor) => {
  //       const contributorEmbeds = contributor['embeds'] as Record<string, unknown>;
  //       const userData = (contributorEmbeds['users'] as Record<string, unknown>)['data'] as Record<string, unknown>;
  //       const userAttributes = userData['attributes'] as Record<string, unknown>;

  //       contributors.push({
  //         id: userData['id'] as string,
  //         type: userData['type'] as string,
  //         fullName: userAttributes['full_name'] as string,
  //         givenName: userAttributes['given_name'] as string,
  //         familyName: userAttributes['family_name'] as string,
  //         middleName: '',
  //       });
  //     });
  //   }

  //   return {
  //     id: response['id'] as string,
  //     type: (response['type'] as string) || 'nodes',
  //     title: attributes['title'] as string,
  //     description: attributes['description'] as string,
  //     category: attributes['category'] as string,
  //     tags: (attributes['tags'] as string[]) || [],
  //     dateCreated: attributes['date_created'] as string,
  //     dateModified: attributes['date_modified'] as string,
  //     isPublic: attributes['public'] as boolean,
  //     isRegistration: attributes['registration'] as boolean,
  //     isPreprint: attributes['preprint'] as boolean,
  //     isFork: attributes['fork'] as boolean,
  //     isCollection: attributes['collection'] as boolean,
  //     accessRequestsEnabled: attributes['access_requests_enabled'] as boolean,
  //     wikiEnabled: attributes['wiki_enabled'] as boolean,
  //     currentUserCanComment: attributes['current_user_can_comment'] as boolean,
  //     currentUserPermissions: (attributes['current_user_permissions'] as string[]) || [],
  //     currentUserIsContributor: attributes['current_user_is_contributor'] as boolean,
  //     currentUserIsContributorOrGroupMember: attributes['current_user_is_contributor_or_group_member'] as boolean,
  //     analyticsKey: '',
  //     contributors: contributors,
  //     subjects: Array.isArray(attributes['subjects']) ? attributes['subjects'].flat() : attributes['subjects'],
  //     forksCount: 0,
  //     viewOnlyLinksCount: 0,
  //   } as ProjectOverview;
  // }
}
