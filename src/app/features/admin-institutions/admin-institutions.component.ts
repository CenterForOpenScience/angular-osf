import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { TabsModule } from 'primeng/tabs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { FetchInstitutionById, InstitutionsAdminSelectors } from '@osf/features/admin-institutions/store';
import { Primitive } from '@osf/shared/helpers';
import { LoadingSpinnerComponent, SelectComponent } from '@shared/components';

import { resourceTabOptions } from './constants';
import { AdminInstitutionResourceTab } from './enums';

@Component({
  selector: 'osf-admin-institutions',
  imports: [TabsModule, TranslatePipe, RouterOutlet, NgOptimizedImage, LoadingSpinnerComponent, SelectComponent],
  templateUrl: './admin-institutions.component.html',
  styleUrl: './admin-institutions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminInstitutionsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  institution = select(InstitutionsAdminSelectors.getInstitution);
  isInstitutionLoading = select(InstitutionsAdminSelectors.getInstitutionLoading);

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
    this.selectedTab = selectedValue as AdminInstitutionResourceTab;
    if (this.selectedTab) {
      this.router.navigate([this.selectedTab], { relativeTo: this.route });
    }
  }
}
