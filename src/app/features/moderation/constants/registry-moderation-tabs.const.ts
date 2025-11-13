import { CustomOption } from '@osf/shared/models/select-option.model';

import { RegistryModerationTab } from '../enums';

export const REGISTRY_MODERATION_TABS: CustomOption<string>[] = [
  { label: 'moderation.submitted', value: RegistryModerationTab.Submitted },
  { label: 'moderation.pending', value: RegistryModerationTab.Pending },
  { label: 'moderation.moderators', value: RegistryModerationTab.Moderators },
  { label: 'moderation.settings', value: RegistryModerationTab.Settings },
];
