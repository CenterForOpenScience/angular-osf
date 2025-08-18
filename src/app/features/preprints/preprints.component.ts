import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { IS_WEB } from '@osf/shared/helpers';

@Component({
  selector: 'osf-preprints',
  imports: [RouterOutlet],
  templateUrl: './preprints.component.html',
  styleUrl: './preprints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsComponent {
  protected readonly isDesktop = toSignal(inject(IS_WEB));
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full';
}
