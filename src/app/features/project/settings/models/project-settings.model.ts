export interface ProjectSettingsModel {
  id: string;
  attributes: ProjectSettingsAttributes;
  lastFetched?: number;
}

interface ProjectSettingsAttributes {
  accessRequestsEnabled: boolean;
  anyoneCanComment: boolean;
  anyoneCanEditWiki: boolean;
  wikiEnabled: boolean;
}
