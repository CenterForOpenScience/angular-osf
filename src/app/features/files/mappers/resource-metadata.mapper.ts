import { ResourceMetadata } from '@osf/shared/models';

import { GetResourceCustomMetadataResponse } from '../models/get-resource-custom-metadata-response.model';
import { GetResourceShortInfoResponse } from '../models/get-resource-short-info-response.model';

export function MapResourceMetadata(
  shortInfo: GetResourceShortInfoResponse,
  customMetadata: GetResourceCustomMetadataResponse
): ResourceMetadata {
  return {
    title: shortInfo.data.attributes.title,
    description: shortInfo.data.attributes.description,
    dateCreated: new Date(shortInfo.data.attributes.date_created),
    dateModified: new Date(shortInfo.data.attributes.date_modified),
    funders: customMetadata.data.embeds.custom_metadata.data.attributes.funders.map((funder) => ({
      funderName: funder.funder_name,
      funderIdentifier: funder.funder_identifier,
      funderIdentifierType: funder.funder_identifier_type,
      awardNumber: funder.award_number,
      awardUri: funder.award_uri,
      awardTitle: funder.award_title,
    })),
    language: customMetadata.data.embeds.custom_metadata.data.attributes.language,
    resourceTypeGeneral: customMetadata.data.embeds.custom_metadata.data.attributes.resource_type_general,
  };
}
