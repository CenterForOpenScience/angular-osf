import { ProviderReviewsWorkflow } from '../enums';

export const decisionSettings = {
  comments: {
    public: 'preprints.details.decision.settings.comments.public',
    private: 'preprints.details.decision.settings.comments.private',
  },
  names: {
    anonymous: 'preprints.details.decision.settings.names.anonymous',
    named: 'preprints.details.decision.settings.names.named',
  },
  moderation: {
    [ProviderReviewsWorkflow.PreModeration]: 'preprints.details.decision.settings.moderation.pre',
    [ProviderReviewsWorkflow.PostModeration]: 'preprints.details.decision.settings.moderation.post',
  },
};

export const decisionExplanation = {
  accept: {
    [ProviderReviewsWorkflow.PreModeration]: 'preprints.details.decision.accept.pre',
    [ProviderReviewsWorkflow.PostModeration]: 'preprints.details.decision.accept.post',
  },
  reject: {
    [ProviderReviewsWorkflow.PreModeration]: 'preprints.details.decision.reject.pre',
    [ProviderReviewsWorkflow.PostModeration]: 'preprints.details.decision.reject.post',
  },
  withdrawn: {
    [ProviderReviewsWorkflow.PostModeration]: 'preprints.details.decision.withdrawn.post',
  },
};
