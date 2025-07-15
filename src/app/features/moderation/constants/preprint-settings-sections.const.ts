import { ModerationType, SettingsSectionControl } from '../enums';

export const PREPRINT_SETTINGS_SECTIONS = [
  {
    control: SettingsSectionControl.ModerationType,
    title: 'moderation.preprintSettings.moderationType.title',
    options: [
      {
        value: ModerationType.Pre,
        label: 'moderation.preprintSettings.moderationType.pre',
        description: 'moderation.preprintSettings.moderationType.preDescription',
      },
      {
        value: ModerationType.Post,
        label: 'moderation.preprintSettings.moderationType.post',
        description: 'moderation.preprintSettings.moderationType.postDescription',
      },
    ],
  },
  {
    control: SettingsSectionControl.CommentVisibility,
    title: 'moderation.preprintSettings.commentVisibility.title',
    description: 'moderation.preprintSettings.commentVisibility.description',
    options: [
      {
        value: true,
        label: 'moderation.preprintSettings.commentVisibility.moderators',
        description: 'moderation.preprintSettings.commentVisibility.moderatorsDescription',
      },
      {
        value: false,
        label: 'moderation.preprintSettings.commentVisibility.moderatorsAndContributors',
        description: 'moderation.preprintSettings.commentVisibility.moderatorsAndContributorsDescription',
      },
    ],
  },
  {
    control: SettingsSectionControl.ModeratorComments,
    title: 'moderation.preprintSettings.moderatorComments.title',
    description: 'moderation.preprintSettings.moderatorComments.description',
    options: [
      {
        value: true,
        label: 'moderation.preprintSettings.moderatorComments.anonymized',
        description: 'moderation.preprintSettings.moderatorComments.anonymizedDescription',
      },
      {
        value: false,
        label: 'moderation.preprintSettings.moderatorComments.named',
        description: 'moderation.preprintSettings.moderatorComments.namedDescription',
      },
    ],
  },
];
