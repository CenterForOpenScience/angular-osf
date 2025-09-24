import { PreprintProviderModerationInfo } from '@osf/features/moderation/models';

export const MOCK_PREPRINT_PROVIDER_MODERATION_INFO: PreprintProviderModerationInfo = {
  id: 'test-provider-id',
  name: 'Test Provider',
  submissionCount: 10,
  reviewsCommentsAnonymous: true,
  reviewsCommentsPrivate: false,
  reviewsWorkflow: 'pre_moderation',
  supportEmail: 'support@test.com',
};
