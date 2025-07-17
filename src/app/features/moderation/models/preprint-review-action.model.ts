import { IdName } from '@osf/shared/models';

export interface PreprintReviewActionModel {
  id: string;
  dateModified: string;
  fromState: string;
  toState: string;
  creator: IdName;
  preprint: IdName;
  provider: IdName;
}
