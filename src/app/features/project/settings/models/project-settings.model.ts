export interface ProjectSettingsModel {
  id: string;
  attributes: {
    accessRequestsEnabled: boolean;
    anyoneCanComment: boolean;
    anyoneCanEditWiki: boolean;
    redirectLinkEnabled: boolean;
    redirectLinkLabel: string;
    redirectLinkUrl: string;
    wikiEnabled: boolean;
  };
  lastFetched?: number;
}
