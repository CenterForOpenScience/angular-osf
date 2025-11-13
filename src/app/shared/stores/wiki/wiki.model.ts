import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';
import { WikiModel, WikiVersion } from '@osf/shared/models/wiki/wiki.model';

export interface WikiModesStateModel {
  view: boolean;
  edit: boolean;
  compare: boolean;
}

export interface ComponentWiki {
  id: string;
  title: string;
  list: WikiModel[];
}

export interface WikiStateModel {
  homeWikiContent: AsyncStateModel<string>;
  wikiModes: WikiModesStateModel;
  wikiList: AsyncStateModel<WikiModel[]>;
  componentsWikiList: AsyncStateModel<ComponentWiki[]>;
  currentWikiId: string;
  previewContent: string;
  wikiVersions: AsyncStateModel<WikiVersion[]>;
  versionContent: AsyncStateModel<string>;
  compareVersionContent: AsyncStateModel<string>;
  isAnonymous: boolean;
}

export const WIKI_STATE_DEFAULTS: WikiStateModel = {
  homeWikiContent: {
    data: '',
    isLoading: false,
    error: null,
  },
  wikiModes: {
    view: true,
    edit: false,
    compare: false,
  },
  wikiList: {
    data: [],
    isLoading: false,
    error: null,
    isSubmitting: false,
  },
  componentsWikiList: {
    data: [],
    isLoading: false,
    error: null,
  },
  currentWikiId: '',
  previewContent: '',
  wikiVersions: {
    data: [],
    isLoading: false,
    error: null,
  },
  versionContent: {
    data: '',
    isLoading: false,
    error: null,
  },
  compareVersionContent: {
    data: '',
    isLoading: false,
    error: null,
  },
  isAnonymous: false,
};
