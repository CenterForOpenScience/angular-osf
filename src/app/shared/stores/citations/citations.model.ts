import { DefaultCitation } from '@shared/models';
import { AsyncStateModel } from '@shared/models/store';

export interface CitationsStateModel {
  defaultCitations: AsyncStateModel<DefaultCitation[]>;
}
