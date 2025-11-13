import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SOCIAL_ICONS } from '@core/constants/social-icons.constant';
import { IconComponent } from '@osf/shared/components/icon/icon.component';

@Component({
  selector: 'osf-footer',
  imports: [RouterLink, TranslatePipe, IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly socialIcons = SOCIAL_ICONS;
}
