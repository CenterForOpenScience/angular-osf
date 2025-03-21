import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_WEB } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-settings-container',
  imports: [RouterOutlet],
  templateUrl: './settings-container.component.html',
  styleUrl: './settings-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsContainerComponent {
  isDesktop = toSignal(inject(IS_WEB));
}
