export interface CollectionSubmissionReviewAction {
  id: string;
  type: string;
  dateCreated: string;
  dateModified: string;
  fromState: string;
  toState: string;
  comment: string;
  trigger: string;
  targetId: string;
  targetNodeId: string;
  createdBy: string;
}
