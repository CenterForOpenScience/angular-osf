import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { IS_WEB } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-project',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent {
  protected readonly isDesktop = toSignal(inject(IS_WEB));
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full h-full';
}
