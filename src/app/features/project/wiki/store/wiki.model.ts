import { AsyncStateModel } from '@osf/shared/models';

export interface WikiStateModel {
  homeWikiContent: AsyncStateModel<string>;
}
