export interface ProjectSettingsResponseJsonApi {
  data: ProjectSettingsDataJsonApi;
  meta: {
    version: string;
  };
}

export interface ProjectSettingsDataJsonApi {
  id: string;
  type: 'node-settings';
  attributes: ProjectSettingsAttributesJsonApi;
  relationships: ProjectSettingsRelationshipsJsonApi;
  links: {
    self: string;
    iri: string;
  };
}

export interface ProjectSettingsAttributesJsonApi {
  access_requests_enabled: boolean;
  anyone_can_edit_wiki: boolean;
  wiki_enabled: boolean;
}

interface ProjectSettingsRelationshipsJsonApi {
  view_only_links: {
    links: {
      related: RelatedLinkJsonApi;
    };
  };
}

interface RelatedLinkJsonApi {
  href: string;
  meta: Record<string, unknown>;
}
