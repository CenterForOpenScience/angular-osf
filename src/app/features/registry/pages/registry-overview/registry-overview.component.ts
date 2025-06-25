import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { OverviewToolbarComponent } from '@osf/features/project/overview/components';
import { SubHeaderComponent } from '@shared/components';

@Component({
  selector: 'osf-registry-overview',
  imports: [SubHeaderComponent, OverviewToolbarComponent],
  templateUrl: './registry-overview.component.html',
  styleUrl: './registry-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class RegistryOverviewComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
}
