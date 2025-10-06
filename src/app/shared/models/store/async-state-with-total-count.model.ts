import { AsyncStateModel } from './async-state.model';

export interface AsyncStateWithTotalCount<T> extends AsyncStateModel<T> {
  totalCount: number;
}
