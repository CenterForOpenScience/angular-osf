import { AuthorizedAccountModel } from '@shared/models';

export interface OAuthCallbacks {
  onSuccess: (addon: AuthorizedAccountModel) => void;
  onError?: () => void;
  onCleanup?: () => void;
}
