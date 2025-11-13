import { IdNameModel } from '@osf/shared/models/common/id-name.model';

export interface PreprintRequestAction {
  id: string;
  trigger: string;
  comment: string;
  fromState: string;
  toState: string;
  dateModified: Date;
  creator: IdNameModel;
}
