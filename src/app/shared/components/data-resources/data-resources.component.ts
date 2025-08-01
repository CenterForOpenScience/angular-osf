import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'osf-data-resources',
  imports: [TranslatePipe],
  templateUrl: './data-resources.component.html',
  styleUrl: './data-resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataResourcesComponent {
  @HostBinding('class') classes = 'flex-1 flex';
  vertical = input<boolean>(false);
  resourceId = input<string>();
  hasData = input<boolean>();
  hasAnalyticCode = input<boolean>();
  hasMaterials = input<boolean>();
  hasPapers = input<boolean>();
  hasSupplements = input<boolean>();

  getResourceLink(): string {
    return '/registries/' + this.resourceId() + '/resources';
  }
}
