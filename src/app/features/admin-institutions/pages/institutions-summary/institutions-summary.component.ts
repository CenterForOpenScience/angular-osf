import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BarChartComponent, LoadingSpinnerComponent, StatisticCardComponent } from '@shared/components';
import { DoughnutChartComponent } from '@shared/components/doughnut-chart/doughnut-chart.component';
import { DatasetInput, SelectOption } from '@shared/models';

import {
  FetchHasOsfAddonSearch,
  FetchInstitutionDepartments,
  FetchInstitutionSearchResults,
  FetchInstitutionSummaryMetrics,
  FetchStorageRegionSearch,
  InstitutionsAdminSelectors,
} from '../../store';

@Component({
  selector: 'osf-institutions-summary',
  imports: [StatisticCardComponent, LoadingSpinnerComponent, DoughnutChartComponent, BarChartComponent, TranslatePipe],
  templateUrl: './institutions-summary.component.html',
  styleUrl: './institutions-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsSummaryComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly translateService = inject(TranslateService);

  statisticsData: SelectOption[] = [];

  departments = select(InstitutionsAdminSelectors.getDepartments);
  departmentsLoading = select(InstitutionsAdminSelectors.getDepartmentsLoading);

  summaryMetrics = select(InstitutionsAdminSelectors.getSummaryMetrics);
  summaryMetricsLoading = select(InstitutionsAdminSelectors.getSummaryMetricsLoading);

  hasOsfAddonSearch = select(InstitutionsAdminSelectors.getHasOsfAddonSearch);

  storageRegionSearch = select(InstitutionsAdminSelectors.getStorageRegionSearch);
  storageRegionSearchLoading = select(InstitutionsAdminSelectors.getStorageRegionSearchLoading);

  rightsSearch = select(InstitutionsAdminSelectors.getSearchResults);
  rightsLoading = select(InstitutionsAdminSelectors.getSearchResultsLoading);

  departmentLabels = signal<string[]>([]);
  departmentDataset = signal<DatasetInput[]>([]);

  projectsLabels = signal<string[]>([]);
  projectDataset = signal<DatasetInput[]>([]);

  registrationsLabels = signal<string[]>([]);
  registrationsDataset = signal<DatasetInput[]>([]);

  osfProjectsLabels = signal<string[]>([]);
  osfProjectsDataset = signal<DatasetInput[]>([]);

  storageLabels = signal<string[]>([]);
  storageDataset = signal<DatasetInput[]>([]);

  licenceLabels = signal<string[]>([]);
  licenceDataset = signal<DatasetInput[]>([]);

  addonLabels = signal<string[]>([]);
  addonDataset = signal<DatasetInput[]>([]);

  private readonly actions = createDispatchMap({
    fetchDepartments: FetchInstitutionDepartments,
    fetchSummaryMetrics: FetchInstitutionSummaryMetrics,
    fetchHasOsfAddonSearch: FetchHasOsfAddonSearch,
    fetchStorageRegionSearch: FetchStorageRegionSearch,
    fetchSearchResults: FetchInstitutionSearchResults,
  });

  constructor() {
    this.setStatisticSummaryDataEffect();
    this.setDepartmentsEffect();
    this.setSummaryMetricsEffect();
    this.setStorageEffect();
    this.setLicenseEffect();
    this.setAddonsEffect();
  }

  ngOnInit(): void {
    const institutionId = this.route.parent?.snapshot.params['institution-id'];

    if (institutionId) {
      this.actions.fetchSearchResults('rights');
      this.actions.fetchDepartments();
      this.actions.fetchSummaryMetrics();
      this.actions.fetchHasOsfAddonSearch();
      this.actions.fetchStorageRegionSearch();
    }
  }

  private setStatisticSummaryDataEffect(): void {
    effect(() => {
      const summary = this.summaryMetrics();

      if (summary) {
        this.statisticsData = [
          {
            label: 'adminInstitutions.summary.totalUsers',
            value: summary.userCount,
          },
          {
            label: 'adminInstitutions.summary.totalMonthlyLoggedInUsers',
            value: summary.monthlyLoggedInUserCount,
          },
          {
            label: 'adminInstitutions.summary.totalMonthlyActiveUsers',
            value: summary.monthlyActiveUserCount,
          },
          {
            label: 'adminInstitutions.summary.osfPublicAndPrivateProjects',
            value: summary.publicProjectCount + summary.privateProjectCount,
          },
          {
            label: 'adminInstitutions.summary.osfPublicAndEmbargoedRegistrations',
            value: summary.publicRegistrationCount + summary.embargoedRegistrationCount,
          },
          {
            label: 'adminInstitutions.summary.osfPreprints',
            value: summary.publishedPreprintCount,
          },
          {
            label: 'adminInstitutions.summary.totalPublicFileCount',
            value: summary.publicFileCount,
          },
          {
            label: 'adminInstitutions.summary.totalStorageInGb',
            value: this.convertBytesToGB(summary.storageByteCount),
          },
        ];
      }
    });
  }

  private setAddonsEffect(): void {
    effect(() => {
      const addons = this.hasOsfAddonSearch();

      this.addonLabels.set(addons.map((result) => result.label));
      this.addonDataset.set([{ label: '', data: addons.map((result) => +result.value) }]);
    });
  }

  private convertBytesToGB(bytes: number): string {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(1);
  }

  private setDepartmentsEffect() {
    effect(() => {
      const departments = this.departments();

      this.departmentLabels.set(departments.map((item) => item.name || ''));
      this.departmentDataset.set([{ label: '', data: departments.map((item) => item.numberOfUsers) }]);
    });
  }

  private setSummaryMetricsEffect() {
    effect(() => {
      const summary = this.summaryMetrics();

      this.projectsLabels.set(
        ['resourceCard.labels.publicProjects', 'adminInstitutions.summary.privateProjects'].map((el) =>
          this.translateService.instant(el)
        )
      );
      this.projectDataset.set([{ label: '', data: [summary.publicProjectCount, summary.privateProjectCount] }]);

      this.registrationsLabels.set(
        ['resourceCard.labels.publicRegistrations', 'adminInstitutions.summary.embargoedRegistrations'].map((el) =>
          this.translateService.instant(el)
        )
      );
      this.registrationsDataset.set([
        { label: '', data: [summary.publicRegistrationCount, summary.embargoedRegistrationCount] },
      ]);

      this.osfProjectsLabels.set(
        [
          'adminInstitutions.summary.publicRegistrations',
          'adminInstitutions.summary.embargoedRegistrations',
          'adminInstitutions.summary.publicProjects',
          'adminInstitutions.summary.privateProjects',
          'common.search.tabs.preprints',
        ].map((el) => this.translateService.instant(el))
      );
      this.osfProjectsDataset.set([
        {
          label: '',
          data: [
            summary.publicRegistrationCount,
            summary.embargoedRegistrationCount,
            summary.publicProjectCount,
            summary.privateProjectCount,
            summary.publishedPreprintCount,
          ],
        },
      ]);
    });
  }

  private setStorageEffect() {
    effect(() => {
      const storage = this.storageRegionSearch();

      this.storageLabels.set(storage.map((result) => result.label));
      this.storageDataset.set([{ label: '', data: storage.map((result) => +result.value) }]);
    });
  }

  private setLicenseEffect() {
    effect(() => {
      const licenses = this.rightsSearch();

      this.licenceLabels.set(licenses.map((result) => result.label));
      this.licenceDataset.set([{ label: '', data: licenses.map((result) => +result.value) }]);
    });
  }
}
