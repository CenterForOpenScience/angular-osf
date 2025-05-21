import { AsyncStateModel } from '@osf/shared/models/store';

export interface WikiStateModel {
  homeWikiContent: AsyncStateModel<string>;
}
