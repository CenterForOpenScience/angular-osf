import { AsyncStateWithTotalCount, PaginationLinksModel } from '@shared/models';

export interface AsyncStateWithLinksModel<T> extends AsyncStateWithTotalCount<T> {
  links?: PaginationLinksModel;
}
