import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ContributorsSelectors, LoadMoreBibliographicContributors } from '@osf/shared/stores/contributors';

import { RegistrationOverviewModel } from '../../models';

@Component({
  selector: 'osf-short-registration-info',
  imports: [TranslatePipe, DatePipe, RouterLink, ContributorsListComponent],
  templateUrl: './short-registration-info.component.html',
  styleUrl: './short-registration-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortRegistrationInfoComponent {
  private readonly environment = inject(ENVIRONMENT);

  registration = input.required<RegistrationOverviewModel>();

  bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  isBibliographicContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  hasMoreBibliographicContributors = select(ContributorsSelectors.hasMoreBibliographicContributors);

  private readonly actions = createDispatchMap({
    loadMoreBibliographicContributors: LoadMoreBibliographicContributors,
  });

  associatedProjectUrl = computed(() => `${this.environment.webUrl}/${this.registration().associatedProjectId}`);

  handleLoadMoreContributors(): void {
    this.actions.loadMoreBibliographicContributors(this.registration()?.id, ResourceType.Registration);
  }
}
