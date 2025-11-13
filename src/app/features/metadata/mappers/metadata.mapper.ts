import { IdentifiersMapper } from '@osf/shared/mappers/identifiers.mapper';
import { LicensesMapper } from '@osf/shared/mappers/licenses.mapper';

import { CustomItemMetadataRecord, CustomMetadataJsonApi, MetadataJsonApi, MetadataModel } from '../models';

export class MetadataMapper {
  static fromMetadataApiResponse(response: MetadataJsonApi): MetadataModel {
    return {
      id: response.id,
      title: response.attributes.title,
      description: response.attributes.description,
      tags: response.attributes.tags,
      dateCreated: response.attributes.date_created,
      dateModified: response.attributes.date_modified,
      publicationDoi: response.attributes.article_doi,
      license: LicensesMapper.fromLicenseDataJsonApi(response.embeds?.license?.data),
      nodeLicense: response.attributes.node_license
        ? {
            copyrightHolders: response.attributes.node_license.copyright_holders || [],
            year: response.attributes.node_license.year || '',
          }
        : undefined,
      identifiers: IdentifiersMapper.fromJsonApi(response.embeds?.identifiers),
      provider: response.embeds?.provider?.data.id,
      public: response.attributes.public,
      currentUserPermissions: response.attributes.current_user_permissions,
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
}
