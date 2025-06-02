import { GetProjectCustomMetadataResponse } from '@osf/features/project/files/models/responses/get-project-custom-metadata-response.model';
import { GetProjectShortInfoResponse } from '@osf/features/project/files/models/responses/get-project-short-info-response.model';

import { OsfProjectMetadata } from '../models/osf-models/project-custom-metadata.model';

export function MapProjectMetadata(
  shortInfo: GetProjectShortInfoResponse,
  customMetadata: GetProjectCustomMetadataResponse
): OsfProjectMetadata {
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
