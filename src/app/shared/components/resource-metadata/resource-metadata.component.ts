import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { OverviewCollectionsComponent } from '@osf/features/project/overview/components/overview-collections/overview-collections.component';
import { CurrentResourceType } from '@osf/shared/enums';
import { ResourceOverview } from '@shared/models';

import { AffiliatedInstitutionsViewComponent } from '../affiliated-institutions-view/affiliated-institutions-view.component';
import { ResourceCitationsComponent } from '../resource-citations/resource-citations.component';
import { TruncatedTextComponent } from '../truncated-text/truncated-text.component';

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
  private readonly environment = inject(ENVIRONMENT);
  private readonly router = inject(Router);

  currentResource = input.required<ResourceOverview | null>();
  customCitationUpdated = output<string>();
  isCollectionsRoute = input<boolean>(false);
  canWrite = input.required<boolean>();

  readonly resourceTypes = CurrentResourceType;
  readonly dateFormat = 'MMM d, y, h:mm a';
  readonly webUrl = this.environment.webUrl;

  isProject = computed(() => this.currentResource()?.type === CurrentResourceType.Projects);
  isRegistration = computed(() => this.currentResource()?.type === CurrentResourceType.Registrations);

  onCustomCitationUpdated(citation: string): void {
    this.customCitationUpdated.emit(citation);
  }

  tagClicked(tag: string) {
    this.router.navigate(['/search'], { queryParams: { search: tag } });
  }
}
