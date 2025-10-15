import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { SOCIAL_SHARE_URLS } from '../constants';
import { ShareableContent, SocialShareLinks } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SocialShareService {
  private readonly environment = inject(ENVIRONMENT);

  get webUrl() {
    return this.environment.webUrl;
  }

  generateEmailLink(content: ShareableContent): string {
    const subject = encodeURIComponent(content.title);
    const body = encodeURIComponent(content.url);

    return `${SOCIAL_SHARE_URLS.email}?subject=${subject}&body=${body}`;
  }

  generateTwitterLink(content: ShareableContent): string {
    const url = encodeURIComponent(content.url);
    const text = encodeURIComponent(content.title);

    return `${SOCIAL_SHARE_URLS.twitter.preview_url}?url=${url}&text=${text}&via=${SOCIAL_SHARE_URLS.twitter.viaHandle}`;
  }

  generateFacebookLink(content: ShareableContent): string {
    const href = encodeURIComponent(content.url);

    return `${SOCIAL_SHARE_URLS.facebook}?u=${href}`;
  }

  generateLinkedInLink(content: ShareableContent): string {
    const url = encodeURIComponent(content.url);

    return `${SOCIAL_SHARE_URLS.linkedIn}?url=${url}`;
  }

  generateMastodonLink(content: ShareableContent): string {
    const url = encodeURIComponent(content.url);
    const text = encodeURIComponent(content.title);

    return `${SOCIAL_SHARE_URLS.mastodon}?url=${url}&text=${text}`;
  }

  generateBlueskyLink(content: ShareableContent): string {
    const text = encodeURIComponent(`${content.title} ${content.url}`);

    return `${SOCIAL_SHARE_URLS.bluesky}?text=${text}`;
  }

  generateAllSharingLinks(content: ShareableContent): SocialShareLinks {
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

  createProjectUrl(projectId: string): string {
    return `${this.webUrl}/${projectId}`;
  }

  createRegistrationUrl(registrationId: string, providerId = 'osf'): string {
    return `${this.webUrl}/registries/${providerId}/${registrationId}`;
  }

  createDownloadUrl(resourceId: string): string {
    return `${this.webUrl}/download/${resourceId}`;
  }
}
