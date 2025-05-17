import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { IS_WEB } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-meetings',
  imports: [RouterOutlet],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingsComponent {
  protected readonly isDesktop = toSignal(inject(IS_WEB));
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full h-full';
}
