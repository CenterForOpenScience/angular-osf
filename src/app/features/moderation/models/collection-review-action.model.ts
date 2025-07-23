export interface CollectionReviewAction {
  id: string;
  type: string;
  dateModified: string;
  fromState: string;
  toState: string;
  comment: string;
  trigger: string;
}
