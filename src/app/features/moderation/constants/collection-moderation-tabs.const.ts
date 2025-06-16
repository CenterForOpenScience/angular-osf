import { SelectOption, TabOption } from '@osf/shared/models';

import { CollectionModerationTab, ModeratorPermission } from '../enums';

export const COLLECTION_MODERATION_TABS: TabOption[] = [
  { label: 'moderation.allItems', value: CollectionModerationTab.AllItems },
  { label: 'moderation.moderators', value: CollectionModerationTab.Moderators },
  { label: 'moderation.settings', value: CollectionModerationTab.Settings },
];

export const MODERATION_PERMISSIONS: SelectOption[] = [
  { label: 'moderation.moderatorPermissions.administrator', value: ModeratorPermission.Admin },
  { label: 'moderation.moderatorPermissions.moderator', value: ModeratorPermission.Moderator },
];
