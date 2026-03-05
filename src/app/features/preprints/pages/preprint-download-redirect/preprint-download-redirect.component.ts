import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SocialShareService } from '@osf/shared/services/social-share.service';

@Component({
  selector: 'osf-preprint-download-redirect',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintDownloadRedirectComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly socialShareService = inject(SocialShareService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    if (!id || !this.isBrowser) {
      return;
    }

    const url = this.socialShareService.createDownloadUrl(id);
    window.location.replace(url);
  }
}
