import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { SocialShareContentModel } from '@osf/shared/models/socials/social-share-content.model';
import { SocialShareService } from '@osf/shared/services/social-share.service';

import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'osf-socials-share-button',
  imports: [Menu, Button, Tooltip, IconComponent, TranslatePipe],
  templateUrl: './socials-share-button.component.html',
  styleUrl: './socials-share-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialsShareButtonComponent {
  private readonly socialShareService = inject(SocialShareService);

  resourceId = input.required<string>();
  resourceTitle = input.required<string>();
  resourceType = input.required<ResourceType>();
  resourceProvider = input<string>('');

  socialsActionItems = computed(() => {
    const resourceUrl =
      this.resourceType() === ResourceType.Preprint
        ? this.socialShareService.createPreprintUrl(this.resourceId(), this.resourceProvider())
        : this.socialShareService.createGuidUrl(this.resourceId());

    const shareableContent: SocialShareContentModel = {
      id: this.resourceId(),
      title: this.resourceTitle(),
      url: resourceUrl,
    };

    return this.socialShareService.generateSocialActionItems(shareableContent);
  });
}
