import { Injectable } from '@angular/core';

import { SOCIAL_SHARE_URLS } from '@shared/config/social-share.config';
import { ShareableContent, SocialShareLinks } from '@shared/models/social-share.model';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocialShareService {
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
    return `${environment.webUrl}/preprints/${providerId}/${preprintId}`;
  }

  createProjectUrl(projectId: string): string {
    return `${environment.webUrl}/${projectId}`;
  }

  createRegistrationUrl(registrationId: string, providerId = 'osf'): string {
    return `${environment.webUrl}/registries/${providerId}/${registrationId}`;
  }

  createDownloadUrl(resourceId: string): string {
    return `${environment.webUrl}/download/${resourceId}`;
  }
}
