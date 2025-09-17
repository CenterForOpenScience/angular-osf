import { InstitutionsMapper } from '@osf/shared/mappers';

import {
  NodeDataJsonApi,
  NodeDetailsModel,
  ProjectSettingsData,
  ProjectSettingsModel,
  ProjectSettingsResponseModel,
} from '../models';

export class SettingsMapper {
  static fromResponse(
    response: ProjectSettingsResponseModel | ProjectSettingsData,
    nodeId: string
  ): ProjectSettingsModel {
    const result = 'data' in response ? response.data : response;

    return {
      id: nodeId,
      attributes: {
        accessRequestsEnabled: result.attributes.access_requests_enabled,
        anyoneCanEditWiki: result.attributes.anyone_can_edit_wiki,
        wikiEnabled: result.attributes.wiki_enabled,
      },
    } as ProjectSettingsModel;
  }

  static fromNodeResponse(data: NodeDataJsonApi): NodeDetailsModel {
    return {
      id: data.id,
      title: data.attributes.title,
      description: data.attributes.description,
      isPublic: data.attributes.public,
      region: {
        id: data.embeds?.region.data.id,
        name: data.embeds?.region.data.attributes.name,
      },
      affiliatedInstitutions: data.embeds
        ? InstitutionsMapper.fromInstitutionsResponse(data.embeds.affiliated_institutions)
        : [],
      lastFetched: Date.now(),
    };
  }
}
