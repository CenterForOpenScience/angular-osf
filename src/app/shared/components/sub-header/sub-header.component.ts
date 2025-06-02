import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-sub-header',
  imports: [Button, Skeleton],
  templateUrl: './sub-header.component.html',
  styleUrl: './sub-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubHeaderComponent {
  showButton = input<boolean>(false);
  buttonLabel = input<string>('');
  title = input<string>('');
  icon = input<string>('');
  description = input<string>('');
  isLoading = input<boolean>(false);
  buttonClick = output<void>();
  #isXSmall$ = inject(IS_XSMALL);
  isXSmall = toSignal(this.#isXSmall$);
}
