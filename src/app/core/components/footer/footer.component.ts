import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { SOCIAL_ICONS } from '@osf/core/constants';
import { IconComponent } from '@osf/shared/components';
import { IS_WEB } from '@shared/utils';

@Component({
  selector: 'osf-footer',
  imports: [RouterLink, TranslatePipe, IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  isWeb = toSignal(inject(IS_WEB));

  protected readonly socialIcons = SOCIAL_ICONS;
}
