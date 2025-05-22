import { AsyncStateModel } from '@shared/models/store/async-state.model';

export type AsyncStateWithTotalCount<T> = AsyncStateModel<T> & {
  totalCount: number;
};
