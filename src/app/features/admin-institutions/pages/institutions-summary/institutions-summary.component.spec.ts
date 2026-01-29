import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import {
  FetchHasOsfAddonSearch,
  FetchInstitutionDepartments,
  FetchInstitutionSearchResults,
  FetchInstitutionSummaryMetrics,
  FetchStorageRegionSearch,
  InstitutionsAdminSelectors,
} from '@osf/features/admin-institutions/store';
import { BarChartComponent } from '@osf/shared/components/bar-chart/bar-chart.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { StatisticCardComponent } from '@osf/shared/components/statistic-card/statistic-card.component';
import { DoughnutChartComponent } from '@shared/components/doughnut-chart/doughnut-chart.component';

import { InstitutionsSummaryComponent } from './institutions-summary.component';

import {
  MOCK_ADMIN_INSTITUTIONS_DEPARTMENTS,
  MOCK_ADMIN_INSTITUTIONS_SEARCH_FILTERS,
  MOCK_ADMIN_INSTITUTIONS_STORAGE_FILTERS,
  MOCK_ADMIN_INSTITUTIONS_SUMMARY_METRICS,
} from '@testing/mocks/admin-institutions.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('InstitutionsSummaryComponent', () => {
  let component: InstitutionsSummaryComponent;
  let fixture: ComponentFixture<InstitutionsSummaryComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InstitutionsSummaryComponent,
        OSFTestingModule,
        ...MockComponents(StatisticCardComponent, LoadingSpinnerComponent, DoughnutChartComponent, BarChartComponent),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { snapshot: { params: { institutionId: 'test-institution' } } },
            queryParams: of({}),
          },
        },
        provideMockStore({
          signals: [
            {
              selector: InstitutionsAdminSelectors.getDepartments,
              value: MOCK_ADMIN_INSTITUTIONS_DEPARTMENTS,
            },
            {
              selector: InstitutionsAdminSelectors.getDepartmentsLoading,
              value: false,
            },
            {
              selector: InstitutionsAdminSelectors.getSummaryMetrics,
              value: MOCK_ADMIN_INSTITUTIONS_SUMMARY_METRICS,
            },
            {
              selector: InstitutionsAdminSelectors.getSummaryMetricsLoading,
              value: false,
            },
            {
              selector: InstitutionsAdminSelectors.getHasOsfAddonSearch,
              value: MOCK_ADMIN_INSTITUTIONS_SEARCH_FILTERS,
            },
            {
              selector: InstitutionsAdminSelectors.getStorageRegionSearch,
              value: MOCK_ADMIN_INSTITUTIONS_STORAGE_FILTERS,
            },
            {
              selector: InstitutionsAdminSelectors.getSearchResults,
              value: MOCK_ADMIN_INSTITUTIONS_SEARCH_FILTERS,
            },
            {
              selector: InstitutionsAdminSelectors.getSearchResultsLoading,
              value: false,
            },
          ],
        }),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsSummaryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch actions on ngOnInit when institutionId is present', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(new FetchInstitutionSearchResults('rights'));
    expect(dispatchSpy).toHaveBeenCalledWith(new FetchInstitutionDepartments());
    expect(dispatchSpy).toHaveBeenCalledWith(new FetchInstitutionSummaryMetrics());
    expect(dispatchSpy).toHaveBeenCalledWith(new FetchHasOsfAddonSearch());
    expect(dispatchSpy).toHaveBeenCalledWith(new FetchStorageRegionSearch());
  });

  it('should process summary metrics into statisticsData', () => {
    expect(component.statisticsData).toEqual([
      {
        label: 'adminInstitutions.summary.totalUsers',
        value: 100,
      },
      {
        label: 'adminInstitutions.summary.totalMonthlyLoggedInUsers',
        value: 80,
      },
      {
        label: 'adminInstitutions.summary.totalMonthlyActiveUsers',
        value: 60,
      },
      {
        label: 'adminInstitutions.summary.osfPublicAndPrivateProjects',
        value: 75,
      },
      {
        label: 'adminInstitutions.summary.osfPublicAndEmbargoedRegistrations',
        value: 40,
      },
      {
        label: 'adminInstitutions.summary.osfPreprints',
        value: 20,
      },
      {
        label: 'adminInstitutions.summary.totalPublicFileCount',
        value: 500,
      },
      {
        label: 'adminInstitutions.summary.totalStorageInGb',
        value: '1.0',
      },
    ]);
  });

  it('should process departments data into chart signals', () => {
    expect(component.departmentLabels()).toEqual(['Computer Science', 'Biology']);
    expect(component.departmentDataset()).toEqual([{ label: '', data: [45, 30] }]);
  });

  it('should process and aggregate storage region data into chart signals', () => {
    expect(component.storageLabels()).toEqual(['US East', 'EU West']);
    expect(component.storageDataset()).toEqual([{ label: '', data: [150, 75] }]);
  });

  it('should process license/rights data into chart signals sorted by value descending', () => {
    expect(component.licenseLabels()).toEqual(['Filter 1', 'Filter 2']);
    expect(component.licenseDataset()).toEqual([{ label: '', data: [10, 5] }]);
  });

  it('should process addon data into chart signals sorted by value descending', () => {
    expect(component.addonLabels()).toEqual(['Filter 1', 'Filter 2']);
    expect(component.addonDataset()).toEqual([{ label: '', data: [10, 5] }]);
  });

  it('should convert bytes to GB correctly', () => {
    expect((component as any).convertBytesToGB(1073741824)).toBe('1.0');
    expect((component as any).convertBytesToGB(536870912)).toBe('0.5');
    expect((component as any).convertBytesToGB(0)).toBe('0.0');
  });
});
