export interface PreprintProviderModerationInfo {
  id: string;
  name: string;
  submissionCount?: number;
  reviewsCommentsAnonymous: boolean;
  reviewsCommentsPrivate: boolean;
  reviewsWorkflow: boolean;
  supportEmail?: string;
}
