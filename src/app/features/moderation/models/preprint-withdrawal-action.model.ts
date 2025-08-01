import { IdName } from '@osf/shared/models';

export interface PreprintWithdrawalAction {
  id: string;
  dateModified: string;
  creator: IdName;
  comment: string;
}
