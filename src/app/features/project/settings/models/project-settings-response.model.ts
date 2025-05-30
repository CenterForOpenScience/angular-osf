export interface ProjectSettingsAttributes {
  access_requests_enabled: boolean;
  anyone_can_comment: boolean;
  anyone_can_edit_wiki: boolean;
  wiki_enabled: boolean;
  redirect_link_enabled: boolean;
  redirect_link_url: string;
  redirect_link_label: string;
}

export interface RelatedLink {
  href: string;
  meta: Record<string, unknown>;
}

export interface ProjectSettingsRelationships {
  view_only_links: {
    links: {
      related: RelatedLink;
    };
  };
}

export interface ProjectSettingsData {
  id: string;
  type: 'node-settings';
  attributes: ProjectSettingsAttributes;
  relationships: ProjectSettingsRelationships;
  links: {
    self: string;
    iri: string;
  };
}

export interface ProjectSettingsResponseModel {
  data: ProjectSettingsData;
  meta: {
    version: string;
  };
}
