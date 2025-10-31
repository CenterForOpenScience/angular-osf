import { TabOption } from '@osf/shared/models/tab-option.model';

import { ProfileSettingsTabOption } from '../enums';

export const PROFILE_SETTINGS_TAB_OPTIONS: TabOption[] = [
  { label: 'settings.profileSettings.tabs.name', value: ProfileSettingsTabOption.Name },
  { label: 'settings.profileSettings.tabs.social', value: ProfileSettingsTabOption.Social },
  { label: 'settings.profileSettings.tabs.employment', value: ProfileSettingsTabOption.Employment },
  { label: 'settings.profileSettings.tabs.education', value: ProfileSettingsTabOption.Education },
];
