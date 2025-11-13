import { SocialShareLinksModel } from '@osf/shared/models/socials/social-share-links.model';

export const SOCIAL_SHARE_LINKS_MOCK: SocialShareLinksModel = {
  email:
    'mailto:?subject=Sample%20Preprint%20Title&body=Check%20out%20this%20preprint%3A%20https%3A//example.com/preprint/preprint-1',
  twitter:
    'https://twitter.com/intent/tweet?text=Sample%20Preprint%20Title&url=https%3A//example.com/preprint/preprint-1',
  facebook: 'https://www.facebook.com/sharer/sharer.php?u=https%3A//example.com/preprint/preprint-1',
  linkedIn: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A//example.com/preprint/preprint-1',
  mastodon:
    'https://mastodonshare.com/?url=https%3A%2F%2Fstaging4.osf.io%2Fpreprints%2Flawarchive%2Fm5sy9_v1&text=test',
  bluesky:
    'https://bsky.app/intent/compose?text=test%20https%3A%2F%2Fstaging4.osf.io%2Fpreprints%2Flawarchive%2Fm5sy9_v1',
};
