import { createDispatchMap, select } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { TabsModule } from 'primeng/tabs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { resourceTabOptions } from '@osf/features/admin-institutions/constants/resource-tab-option.constant';
import { Primitive } from '@osf/shared/helpers';
import { LoadingSpinnerComponent, SelectComponent } from '@shared/components';
import { FetchInstitutionById, InstitutionsSearchSelectors } from '@shared/stores';

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

  selectedTab = 'summary';

  resourceTabOptions = resourceTabOptions;

  ngOnInit() {
    const institutionId = this.route.snapshot.params['institution-id'];

    if (institutionId) {
      this.actions.fetchInstitution(institutionId);
    }

    this.selectedTab = this.route.snapshot.firstChild?.routeConfig?.path || 'summary';
  }

  onTabChange(selectedValue: Primitive) {
    const value = String(selectedValue);
    this.selectedTab = value;
    const selectedTab = this.resourceTabOptions.find((tab) => tab.value === value);

    if (selectedTab) {
      this.router.navigate([selectedTab.value], { relativeTo: this.route });
    }
  }
}
