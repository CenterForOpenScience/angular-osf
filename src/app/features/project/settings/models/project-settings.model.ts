export interface ProjectSettingsModel {
  id: string;
  attributes: {
    accessRequestsEnabled: boolean;
    anyoneCanComment: boolean;
    anyoneCanEditWiki: boolean;
    wikiEnabled: boolean;
  };
  lastFetched?: number;
}
