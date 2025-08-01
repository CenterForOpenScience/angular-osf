import { SubmissionReviewStatus } from '../enums';

export interface SubmissionReviewOption {
  value: SubmissionReviewStatus;
  icon: string;
  label: string;
  count?: number;
}
