import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, computed, HostBinding, input } from '@angular/core';

import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'osf-data-resources',
  imports: [TranslatePipe, IconComponent],
  templateUrl: './data-resources.component.html',
  styleUrl: './data-resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataResourcesComponent {
  @HostBinding('class') classes = 'flex-1 flex';
  vertical = input<boolean>(false);
  absoluteUrl = input<string>();
  hasData = input<boolean>();
  hasAnalyticCode = input<boolean>();
  hasMaterials = input<boolean>();
  hasPapers = input<boolean>();
  hasSupplements = input<boolean>();

  resourceUrl = computed(() => {
    return this.absoluteUrl() + '/resources';
  });
}
