import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { SOCIAL_SHARE_URLS } from '../constants';
import { ShareableContent, SocialShareLinks } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SocialShareService {
  private readonly environment = inject(ENVIRONMENT);
  private readonly webUrl = this.environment.webUrl;

  generateEmailLink(content: ShareableContent): string {
    const subject = encodeURIComponent(content.title);
    const body = encodeURIComponent(content.url);

    return `${SOCIAL_SHARE_URLS.email}?subject=${subject}&body=${body}`;
  }

  generateTwitterLink(content: ShareableContent): string {
    const url = encodeURIComponent(content.url);
    const text = encodeURIComponent(content.title);

    return `${SOCIAL_SHARE_URLS.twitter}?url=${url}&text=${text}`;
  }

  generateFacebookLink(content: ShareableContent): string {
    const href = encodeURIComponent(content.url);

    return `${SOCIAL_SHARE_URLS.facebook}?u=${href}`;
  }

  generateLinkedInLink(content: ShareableContent): string {
    const url = encodeURIComponent(content.url);
    const title = encodeURIComponent(content.title);
    const summary = encodeURIComponent(content.description || content.title);
    const source = encodeURIComponent('OSF');

    return `${SOCIAL_SHARE_URLS.linkedIn}?mini=true&url=${url}&title=${title}&summary=${summary}&source=${source}`;
  }

  generateAllSharingLinks(content: ShareableContent): SocialShareLinks {
    return {
      email: this.generateEmailLink(content),
      twitter: this.generateTwitterLink(content),
      facebook: this.generateFacebookLink(content),
      linkedIn: this.generateLinkedInLink(content),
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
