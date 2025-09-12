import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OverviewCollectionsComponent } from '@osf/features/project/overview/components/overview-collections/overview-collections.component';
import { CurrentResourceType } from '@osf/shared/enums';
import { ResourceOverview } from '@shared/models';

import { AffiliatedInstitutionsViewComponent } from '../affiliated-institutions-view/affiliated-institutions-view.component';
import { ResourceCitationsComponent } from '../resource-citations/resource-citations.component';
import { TruncatedTextComponent } from '../truncated-text/truncated-text.component';

import { environment } from 'src/environments/environment';

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
    AffiliatedInstitutionsViewComponent,
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

  readonly resourceTypes = CurrentResourceType;
  readonly dateFormat = 'MMM d, y, h:mm a';
  readonly webUrl = environment.webUrl;

  isProject = computed(() => this.currentResource()?.type === CurrentResourceType.Projects);
  isRegistration = computed(() => this.currentResource()?.type === CurrentResourceType.Registrations);

  onCustomCitationUpdated(citation: string): void {
    this.customCitationUpdated.emit(citation);
  }
}
