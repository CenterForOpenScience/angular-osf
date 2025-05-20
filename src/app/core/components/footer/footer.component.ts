import { TranslateModule } from '@ngx-translate/core';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { SocialIcon } from '@osf/shared/entities/social-icon.interface';
import { IS_PORTRAIT, IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-footer',
  imports: [RouterLink, NgOptimizedImage, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  #isPortrait$ = inject(IS_PORTRAIT);
  #isXSmall$ = inject(IS_XSMALL);
  isPortrait = toSignal(this.#isPortrait$);
  isXSmall = toSignal(this.#isXSmall$);

  protected readonly socialIcons: SocialIcon[] = [
    {
      name: 'x',
      url: 'https://x.com/OSFramework',
      ariaLabel: 'X (formerly Twitter)',
    },
    {
      name: 'facebook',
      url: 'https://www.facebook.com/CenterForOpenScience/',
      ariaLabel: 'Facebook',
    },
    {
      name: 'group',
      url: 'https://groups.google.com/g/openscienceframework',
      ariaLabel: 'Group',
    },
    {
      name: 'github',
      url: 'https://github.com/centerforopenscience',
      ariaLabel: 'GitHub',
    },
  ];
}
