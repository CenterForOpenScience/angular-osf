import { SocialPlatformConfig } from '../models/socials/social-platform-config.model';

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    label: 'project.overview.actions.socials.email',
    icon: 'fas fa-envelope',
    urlKey: 'email',
  },
  {
    label: 'project.overview.actions.socials.x',
    icon: 'fab fa-x-twitter',
    urlKey: 'twitter',
  },
  {
    label: 'project.overview.actions.socials.linkedIn',
    icon: 'fab fa-linkedin',
    urlKey: 'linkedIn',
  },
  {
    label: 'project.overview.actions.socials.facebook',
    icon: 'fab fa-facebook-f',
    urlKey: 'facebook',
  },
  {
    label: 'project.overview.actions.socials.mastodon',
    icon: 'fab fa-mastodon',
    urlKey: 'mastodon',
  },
  {
    label: 'project.overview.actions.socials.bluesky',
    icon: 'fab fa-bluesky',
    urlKey: 'bluesky',
  },
];
