import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
  output,
} from '@angular/core';
import { Button } from 'primeng/button';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'osf-sub-header',
  imports: [Button],
  templateUrl: './sub-header.component.html',
  styleUrl: './sub-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubHeaderComponent {
  showButton = input<boolean>(false);
  buttonLabel = input<string>('');
  title = input<string>('');
  icon = input<string>('');
  buttonClick = output<void>();
  #isXSmall$ = inject(IS_XSMALL);
  isXSmall = toSignal(this.#isXSmall$);
}
