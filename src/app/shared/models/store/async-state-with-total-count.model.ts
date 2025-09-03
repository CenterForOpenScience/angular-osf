import { AsyncStateModel } from './async-state.model';

export type AsyncStateWithTotalCount<T> = AsyncStateModel<T> & {
  totalCount: number;
};
