import { IdNameModel } from '@osf/shared/models/common/id-name.model';

export interface PreprintReviewActionModel {
  id: string;
  dateModified: string;
  fromState: string;
  toState: string;
  creator: IdNameModel;
  preprint: IdNameModel;
  provider: IdNameModel;
}
