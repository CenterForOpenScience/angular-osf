import { createDispatchMap, select } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { TabsModule } from 'primeng/tabs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { Primitive } from '@osf/shared/helpers';
import { FetchInstitutionById, InstitutionsSearchSelectors } from '@osf/shared/stores/institutions-search';
import { LoadingSpinnerComponent, SelectComponent } from '@shared/components';

import { resourceTabOptions } from './constants';
import { AdminInstitutionResourceTab } from './enums';

@Component({
  selector: 'osf-admin-institutions',
  imports: [TabsModule, TranslateModule, RouterOutlet, NgOptimizedImage, LoadingSpinnerComponent, SelectComponent],
  templateUrl: './admin-institutions.component.html',
  styleUrl: './admin-institutions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminInstitutionsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  institution = select(InstitutionsSearchSelectors.getInstitution);
  isInstitutionLoading = select(InstitutionsSearchSelectors.getInstitutionLoading);

  private readonly actions = createDispatchMap({
    fetchInstitution: FetchInstitutionById,
  });

  resourceTabOptions = resourceTabOptions;
  selectedTab = AdminInstitutionResourceTab.Summary;

  ngOnInit() {
    const institutionId = this.route.snapshot.params['institution-id'];

    if (institutionId) {
      this.actions.fetchInstitution(institutionId);
    }

    this.selectedTab =
      (this.route.snapshot.firstChild?.routeConfig?.path as AdminInstitutionResourceTab) ||
      AdminInstitutionResourceTab.Summary;
  }

  onTabChange(selectedValue: Primitive) {
    const value = selectedValue as AdminInstitutionResourceTab;
    this.selectedTab = value;

    if (this.selectedTab) {
      this.router.navigate([this.selectedTab], { relativeTo: this.route });
    }
  }
}
