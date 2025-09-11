import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
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

  departmentLabels: string[] = [];
  departmentDataset: DatasetInput[] = [];

  projectsLabels: string[] = [];
  projectDataset: DatasetInput[] = [];

  registrationsLabels: string[] = [];
  registrationsDataset: DatasetInput[] = [];

  osfProjectsLabels: string[] = [];
  osfProjectsDataset: DatasetInput[] = [];

  storageLabels: string[] = [];
  storageDataset: DatasetInput[] = [];

  licenceLabels: string[] = [];
  licenceDataset: DatasetInput[] = [];

  addonLabels: string[] = [];
  addonDataset: DatasetInput[] = [];

  private readonly actions = createDispatchMap({
    fetchDepartments: FetchInstitutionDepartments,
    fetchSummaryMetrics: FetchInstitutionSummaryMetrics,
    fetchHasOsfAddonSearch: FetchHasOsfAddonSearch,
    fetchStorageRegionSearch: FetchStorageRegionSearch,
    fetchSearchResults: FetchInstitutionSearchResults,
  });

  constructor() {
    effect(() => {
      this.setStatisticSummaryData();
      this.setChartData();
    });
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

  private setStatisticSummaryData(): void {
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
  }

  private setChartData(): void {
    const departments = this.departments();
    const summary = this.summaryMetrics();
    const storage = this.storageRegionSearch();
    const licenses = this.rightsSearch();
    const addons = this.hasOsfAddonSearch();

    this.departmentLabels = departments.map((item) => item.name || '');
    this.departmentDataset = [{ label: '', data: departments.map((item) => item.numberOfUsers) }];

    this.projectsLabels = ['resourceCard.labels.publicProjects', 'adminInstitutions.summary.privateProjects'].map(
      (el) => this.translateService.instant(el)
    );
    this.projectDataset = [{ label: '', data: [summary.publicProjectCount, summary.privateProjectCount] }];

    this.registrationsLabels = [
      'resourceCard.labels.publicRegistrations',
      'adminInstitutions.summary.embargoedRegistrations',
    ].map((el) => this.translateService.instant(el));
    this.registrationsDataset = [
      { label: '', data: [summary.publicRegistrationCount, summary.embargoedRegistrationCount] },
    ];

    this.osfProjectsLabels = [
      'resourceCard.labels.publicRegistrations',
      'adminInstitutions.summary.embargoedRegistrations',
      'resourceCard.labels.publicProjects',
      'adminInstitutions.summary.privateProjects',
      'common.search.tabs.preprints',
    ].map((el) => this.translateService.instant(el));
    this.osfProjectsDataset = [
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
    ];

    this.storageLabels = storage.map((result) => result.label);
    this.storageDataset = [{ label: '', data: storage.map((result) => +result.value) }];

    this.licenceLabels = licenses.map((result) => result.label);
    this.licenceDataset = [{ label: '', data: licenses.map((result) => +result.value) }];

    this.addonLabels = addons.map((result) => result.label);
    this.addonDataset = [{ label: '', data: addons.map((result) => +result.value) }];
  }

  private convertBytesToGB(bytes: number): string {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(1);
  }
}
