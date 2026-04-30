import { SocialPlatformConfig } from '../models/socials/social-platform-config.model';

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    label: 'common.labels.email',
    icon: 'fas fa-envelope',
    urlKey: 'email',
  },
  {
    label: 'common.socials.x',
    icon: 'fab fa-x-twitter',
    urlKey: 'twitter',
  },
  {
    label: 'common.socials.linkedIn',
    icon: 'fab fa-linkedin',
    urlKey: 'linkedIn',
  },
  {
    label: 'common.socials.facebook',
    icon: 'fab fa-facebook-f',
    urlKey: 'facebook',
  },
  {
    label: 'common.socials.mastodon',
    icon: 'fab fa-mastodon',
    urlKey: 'mastodon',
  },
  {
    label: 'common.socials.bluesky',
    icon: 'fab fa-bluesky',
    urlKey: 'bluesky',
  },
];
