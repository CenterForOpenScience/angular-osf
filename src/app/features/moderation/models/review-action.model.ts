import { IdName } from '@osf/shared/models';

export interface ReviewAction {
  id: string;
  fromState: string;
  toState: string;
  dateModified: string;
  creator: IdName;
  comment: string;
}
