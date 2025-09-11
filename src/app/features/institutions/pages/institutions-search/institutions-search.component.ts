import { createDispatchMap, select } from '@ngxs/store';

import { SafeHtmlPipe } from 'primeng/menu';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GlobalSearchComponent, LoadingSpinnerComponent } from '@osf/shared/components';
import { SEARCH_TAB_OPTIONS } from '@osf/shared/constants';
import { SetDefaultFilterValue } from '@osf/shared/stores/global-search';
import { FetchInstitutionById, InstitutionsSearchSelectors } from '@osf/shared/stores/institutions-search';

@Component({
  selector: 'osf-institutions-search',
  imports: [FormsModule, NgOptimizedImage, LoadingSpinnerComponent, SafeHtmlPipe, GlobalSearchComponent],
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

  readonly resourceTabOptions = SEARCH_TAB_OPTIONS;

  ngOnInit(): void {
    const institutionId = this.route.snapshot.params['institution-id'];
    if (institutionId) {
      this.actions.fetchInstitution(institutionId).subscribe({
        next: () => {
          this.actions.setDefaultFilterValue('affiliation', this.institution().iris.join(','));
        },
      });
    }
  }
}
