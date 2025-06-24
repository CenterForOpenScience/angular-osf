import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { IS_WEB } from '@shared/utils';

@Component({
  selector: 'osf-registries',
  imports: [RouterOutlet],
  templateUrl: './registries.component.html',
  styleUrl: './registries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesComponent {
  protected readonly isDesktop = toSignal(inject(IS_WEB));
}
