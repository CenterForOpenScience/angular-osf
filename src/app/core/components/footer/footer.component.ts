import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SocialIcon } from '@osf/shared/entities/social-icon.interface';
import { RouterLink } from '@angular/router';
import { IS_PORTRAIT, IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';

@Component({
  standalone: true,
  selector: 'osf-footer',
  imports: [RouterLink, NgOptimizedImage],
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
      url: '#',
      ariaLabel: 'X (formerly Twitter)',
    },
    {
      name: 'facebook',
      url: '#',
      ariaLabel: 'Facebook',
    },
    {
      name: 'group',
      url: '#',
      ariaLabel: 'Group',
    },
    {
      name: 'github',
      url: '#',
      ariaLabel: 'GitHub',
    },
  ];
}
