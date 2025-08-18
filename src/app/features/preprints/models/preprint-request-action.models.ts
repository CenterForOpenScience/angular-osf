import { IdName } from '@shared/models';

export interface PreprintRequestAction {
  id: string;
  trigger: string;
  comment: string;
  fromState: string;
  toState: string;
  dateModified: Date;
  creator: IdName;
}
