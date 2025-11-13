import { createDispatchMap, select } from '@ngxs/store';

import { SafeHtmlPipe } from 'primeng/menu';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SEARCH_TAB_OPTIONS } from '@osf/shared/constants/search-tab-options.const';
import { SetDefaultFilterValue } from '@osf/shared/stores/global-search';
import { FetchInstitutionById, InstitutionsSearchSelectors } from '@osf/shared/stores/institutions-search';

@Component({
  selector: 'osf-institutions-search',
  imports: [FormsModule, NgOptimizedImage, SafeHtmlPipe, LoadingSpinnerComponent, GlobalSearchComponent],
  templateUrl: './institutions-search.component.html',
  styleUrl: './institutions-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsSearchComponent implements OnInit {
  private route = inject(ActivatedRoute);

  private actions = createDispatchMap({
    fetchInstitution: FetchInstitutionById,
    setDefaultFilterValue: SetDefaultFilterValue,
  });

  institution = select(InstitutionsSearchSelectors.getInstitution);
  isInstitutionLoading = select(InstitutionsSearchSelectors.getInstitutionLoading);
  defaultSearchFiltersInitialized = signal<boolean>(false);

  readonly resourceTabOptions = SEARCH_TAB_OPTIONS;

  ngOnInit(): void {
    const institutionId = this.route.snapshot.params['institutionId'];
    if (institutionId) {
      this.actions.fetchInstitution(institutionId).subscribe({
        next: () => {
          this.actions.setDefaultFilterValue(
            'affiliation,isContainedBy.affiliation',
            this.institution().iris.join(',')
          );
          this.defaultSearchFiltersInitialized.set(true);
        },
      });
    }
  }
}
