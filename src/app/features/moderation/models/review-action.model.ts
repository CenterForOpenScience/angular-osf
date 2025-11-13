import { IdNameModel } from '@osf/shared/models/common/id-name.model';

export interface ReviewAction {
  id: string;
  trigger: string;
  fromState: string;
  toState: string;
  dateModified: string;
  creator: IdNameModel | null;
  comment: string;
}
