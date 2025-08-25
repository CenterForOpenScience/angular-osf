import { ProjectSettingsData, ProjectSettingsModel, ProjectSettingsResponseModel } from '../models';

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
        anyoneCanComment: result.attributes.anyone_can_comment,
        anyoneCanEditWiki: result.attributes.anyone_can_edit_wiki,
        redirectLinkEnabled: result.attributes.redirect_link_enabled,
        redirectLinkLabel: result.attributes.redirect_link_label,
        redirectLinkUrl: result.attributes.redirect_link_url,
        wikiEnabled: result.attributes.wiki_enabled,
      },
    } as ProjectSettingsModel;
  }
}
