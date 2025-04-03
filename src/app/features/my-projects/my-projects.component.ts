import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_WEB } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-my-projects',
  imports: [SubHeaderComponent],
  templateUrl: './my-projects.component.html',
  styleUrl: './my-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProjectsComponent {
  isDesktop = toSignal(inject(IS_WEB));
}
