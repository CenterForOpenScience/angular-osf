import { PreprintProviderModerationInfo } from '@osf/features/moderation/models';
import { ReviewPermissions } from '@osf/shared/enums/review-permissions.enum';

export const MOCK_PREPRINT_PROVIDER_MODERATION_INFO: PreprintProviderModerationInfo = {
  id: 'test-provider-id',
  name: 'Test Provider',
  submissionCount: 10,
  reviewsCommentsAnonymous: true,
  reviewsCommentsPrivate: false,
  reviewsWorkflow: 'pre_moderation',
  supportEmail: 'support@test.com',
  permissions: [ReviewPermissions.ViewSubmissions, ReviewPermissions.SetUpModeration],
};
