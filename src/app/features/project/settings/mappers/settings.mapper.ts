import { UserPermissions } from '@osf/shared/enums';
import { InstitutionsMapper } from '@osf/shared/mappers';
import { RegionsMapper } from '@osf/shared/mappers/regions';
import { BaseNodeDataJsonApi } from '@shared/models';

import {
  NodeDetailsModel,
  ProjectSettingsDataJsonApi,
  ProjectSettingsModel,
  ProjectSettingsResponseJsonApi,
} from '../models';

export class SettingsMapper {
  static fromResponse(
    response: ProjectSettingsResponseJsonApi | ProjectSettingsDataJsonApi,
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

  static fromNodeResponse(data: BaseNodeDataJsonApi): NodeDetailsModel {
    return {
      id: data.id,
      title: data.attributes.title,
      description: data.attributes.description,
      isPublic: data.attributes.public,
      region: data.embeds?.region ? RegionsMapper.getRegion(data?.embeds?.region?.data) : null,
      affiliatedInstitutions: data.embeds?.affiliated_institutions
        ? InstitutionsMapper.fromInstitutionsResponse(data.embeds.affiliated_institutions)
        : [],
      currentUserPermissions: data.attributes.current_user_permissions as UserPermissions[],
      rootId: data.relationships.root?.data?.id,
      parentId: data.relationships.parent?.data?.id,
      lastFetched: Date.now(),
    };
  }
}
