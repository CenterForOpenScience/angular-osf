import { AsyncStateModel, Wiki, WikiVersion } from '@osf/shared/models';

export interface WikiModesStateModel {
  view: boolean;
  edit: boolean;
  compare: boolean;
}

export interface ComponentWiki {
  id: string;
  title: string;
  list: Wiki[];
}

export interface WikiStateModel {
  homeWikiContent: AsyncStateModel<string>;
  wikiModes: WikiModesStateModel;
  wikiList: AsyncStateModel<Wiki[]>;
  componentsWikiList: AsyncStateModel<ComponentWiki[]>;
  currentWikiId: string;
  previewContent: string;
  wikiVersions: AsyncStateModel<WikiVersion[]>;
  versionContent: AsyncStateModel<string>;
  compareVersionContent: AsyncStateModel<string>;
  isAnonymous: boolean;
}
