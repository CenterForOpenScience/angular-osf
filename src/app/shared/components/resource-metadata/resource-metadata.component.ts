import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OverviewCollectionsComponent } from '@osf/features/project/overview/components/overview-collections/overview-collections.component';
import { ResourceCitationsComponent } from '@shared/components/resource-citations/resource-citations.component';
import { TruncatedTextComponent } from '@shared/components/truncated-text/truncated-text.component';
import { OsfResourceTypes } from '@shared/constants';
import { ResourceOverview } from '@shared/models';

@Component({
  selector: 'osf-resource-metadata',
  imports: [
    Button,
    TranslatePipe,
    TruncatedTextComponent,
    RouterLink,
    Tag,
    DatePipe,
    ResourceCitationsComponent,
    OverviewCollectionsComponent,
  ],
  templateUrl: './resource-metadata.component.html',
  styleUrl: './resource-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceMetadataComponent {
  currentResource = input.required<ResourceOverview | null>();
  customCitationUpdated = output<string>();
  isCollectionsRoute = input<boolean>(false);
  canWrite = input.required<boolean>();

  protected readonly resourceTypes = OsfResourceTypes;

  onCustomCitationUpdated(citation: string): void {
    this.customCitationUpdated.emit(citation);
  }
}
