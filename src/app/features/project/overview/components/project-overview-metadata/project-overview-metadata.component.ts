import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ResourceCitationsComponent } from '@osf/shared/components/resource-citations/resource-citations.component';
import { ResourceDoiComponent } from '@osf/shared/components/resource-doi/resource-doi.component';
import { ResourceLicenseComponent } from '@osf/shared/components/resource-license/resource-license.component';
import { SubjectsListComponent } from '@osf/shared/components/subjects-list/subjects-list.component';
import { TagsListComponent } from '@osf/shared/components/tags-list/tags-list.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';
import { ResourceOverview } from '@osf/shared/models/resource-overview.model';

import { OverviewCollectionsComponent } from '../overview-collections/overview-collections.component';

@Component({
  selector: 'osf-project-overview-metadata',
  imports: [
    Button,
    TranslatePipe,
    TruncatedTextComponent,
    RouterLink,
    DatePipe,
    ResourceCitationsComponent,
    OverviewCollectionsComponent,
    AffiliatedInstitutionsViewComponent,
    ContributorsListComponent,
    ResourceDoiComponent,
    ResourceLicenseComponent,
    SubjectsListComponent,
    TagsListComponent,
  ],
  templateUrl: './project-overview-metadata.component.html',
  styleUrl: './project-overview-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewMetadataComponent {
  private readonly environment = inject(ENVIRONMENT);
  private readonly router = inject(Router);

  currentResource = input.required<ResourceOverview | null>();
  canEdit = input.required<boolean>();
  bibliographicContributors = input<ContributorModel[]>([]);
  isBibliographicContributorsLoading = input<boolean>(false);
  hasMoreBibliographicContributors = input<boolean>(false);
  loadMoreContributors = output<void>();
  customCitationUpdated = output<string>();

  readonly resourceType = CurrentResourceType.Projects;
  readonly dateFormat = 'MMM d, y, h:mm a';
  readonly webUrl = this.environment.webUrl;

  onCustomCitationUpdated(citation: string): void {
    this.customCitationUpdated.emit(citation);
  }

  tagClicked(tag: string) {
    this.router.navigate(['/search'], { queryParams: { search: tag } });
  }
}
