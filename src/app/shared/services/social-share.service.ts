import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { SOCIAL_PLATFORMS } from '../constants/social-platforms.const';
import { SOCIAL_SHARE_URLS } from '../constants/social-share.config';
import { SocialShareContentModel } from '../models/socials/social-share-content.model';
import { SocialShareLinksModel } from '../models/socials/social-share-links.model';
import { SocialsShareActionItem } from '../models/socials/socials-share-action-item.model';

@Injectable({
  providedIn: 'root',
})
export class SocialShareService {
  private readonly environment = inject(ENVIRONMENT);

  get webUrl() {
    return this.environment.webUrl;
  }

  generateAllSharingLinks(content: SocialShareContentModel): SocialShareLinksModel {
    return {
      email: this.generateEmailLink(content),
      twitter: this.generateTwitterLink(content),
      facebook: this.generateFacebookLink(content),
      linkedIn: this.generateLinkedInLink(content),
      mastodon: this.generateMastodonLink(content),
      bluesky: this.generateBlueskyLink(content),
    };
  }

  createPreprintUrl(preprintId: string, providerId: string): string {
    return `${this.webUrl}/preprints/${providerId}/${preprintId}`;
  }

  createGuidUrl(guid: string): string {
    return `${this.webUrl}/${guid}`;
  }

  createDownloadUrl(resourceId: string): string {
    return `${this.webUrl}/download/${resourceId}`;
  }

  generateSocialActionItems(content: SocialShareContentModel): SocialsShareActionItem[] {
    const shareLinks = this.generateAllSharingLinks(content);

    return SOCIAL_PLATFORMS.map((platform) => ({
      label: platform.label,
      icon: platform.icon,
      url: shareLinks[platform.urlKey],
    }));
  }

  private generateEmailLink(content: SocialShareContentModel): string {
    const subject = encodeURIComponent(content.title);
    const body = encodeURIComponent(content.url);

    return `${SOCIAL_SHARE_URLS.email}?subject=${subject}&body=${body}`;
  }

  private generateTwitterLink(content: SocialShareContentModel): string {
    const url = encodeURIComponent(content.url);
    const text = encodeURIComponent(content.title);

    return `${SOCIAL_SHARE_URLS.twitter.preview_url}?url=${url}&text=${text}&via=${SOCIAL_SHARE_URLS.twitter.viaHandle}`;
  }

  private generateFacebookLink(content: SocialShareContentModel): string {
    const href = encodeURIComponent(content.url);

    return `${SOCIAL_SHARE_URLS.facebook}?u=${href}`;
  }

  private generateLinkedInLink(content: SocialShareContentModel): string {
    const url = encodeURIComponent(content.url);

    return `${SOCIAL_SHARE_URLS.linkedIn}?url=${url}`;
  }

  private generateMastodonLink(content: SocialShareContentModel): string {
    const url = encodeURIComponent(content.url);
    const text = encodeURIComponent(content.title);

    return `${SOCIAL_SHARE_URLS.mastodon}?url=${url}&text=${text}`;
  }

  private generateBlueskyLink(content: SocialShareContentModel): string {
    const text = encodeURIComponent(`${content.title} ${content.url}`);

    return `${SOCIAL_SHARE_URLS.bluesky}?text=${text}`;
  }
}
