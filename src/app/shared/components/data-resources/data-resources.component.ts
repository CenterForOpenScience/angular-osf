import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'osf-data-resources',
  imports: [TranslatePipe, RouterLink, IconComponent],
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

  get resourceLink(): string {
    return `/${this.resourceId()}/resources`;
  }
}
