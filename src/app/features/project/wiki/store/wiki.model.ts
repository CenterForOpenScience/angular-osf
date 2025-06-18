import { AsyncStateModel } from '@osf/shared/models';

import { Wiki, WikiVersion } from '../models';

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
  projectWikiList: AsyncStateModel<Wiki[]>;
  projectComponentsWikiList: AsyncStateModel<ComponentWiki[]>;
  currentWikiId: string;
  previewContent: string;
  wikiVersions: AsyncStateModel<WikiVersion[]>;
  versionContent: AsyncStateModel<string>;
  compareVersionContent: AsyncStateModel<string>;
}
