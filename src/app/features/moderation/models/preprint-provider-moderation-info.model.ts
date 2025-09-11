export interface PreprintProviderModerationInfo {
  id: string;
  name: string;
  submissionCount?: number;
  reviewsCommentsAnonymous: boolean;
  reviewsCommentsPrivate: boolean;
  reviewsWorkflow: string;
  supportEmail: string | null;
}
