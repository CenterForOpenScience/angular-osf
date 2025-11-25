import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { AnalyticsComponent } from '@osf/features/analytics/analytics.component';
import { AnalyticsKpiComponent } from '@osf/features/analytics/components';
import { AnalyticsSelectors } from '@osf/features/analytics/store';
import { BarChartComponent } from '@osf/shared/components/bar-chart/bar-chart.component';
import { LineChartComponent } from '@osf/shared/components/line-chart/line-chart.component';
import { PieChartComponent } from '@osf/shared/components/pie-chart/pie-chart.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { IS_WEB } from '@osf/shared/helpers/breakpoints.tokens';

import { MOCK_ANALYTICS_METRICS, MOCK_RELATED_COUNTS } from '@testing/mocks/analytics.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: Analytics', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  const resourceId = 'ex212';
  const metrics = { ...MOCK_ANALYTICS_METRICS, id: resourceId };
  const relatedCounts = { ...MOCK_RELATED_COUNTS, id: resourceId };
  const metricsSelector = AnalyticsSelectors.getMetrics(resourceId);
  const relatedCountsSelector = AnalyticsSelectors.getRelatedCounts(resourceId);

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().build();
    activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withParams({ id: resourceId })
      .withData({ resourceType: undefined })
      .build();

    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [
        AnalyticsComponent,
        ...MockComponents(
          SubHeaderComponent,
          AnalyticsKpiComponent,
          LineChartComponent,
          BarChartComponent,
          PieChartComponent,
          ViewOnlyLinkMessageComponent,
          SelectComponent
        ),
        OSFTestingModule,
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: metricsSelector, value: metrics },
            { selector: relatedCountsSelector, value: relatedCounts },
            { selector: AnalyticsSelectors.isMetricsLoading, value: false },
            { selector: AnalyticsSelectors.isRelatedCountsLoading, value: false },
            { selector: AnalyticsSelectors.isMetricsError, value: false },
          ],
        }),
        { provide: IS_WEB, useValue: of(true) },
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
  });

  it('should set selectedRange via onRangeChange', () => {
    fixture.detectChanges();
    component.onRangeChange('month');
    expect(component.selectedRange()).toBe('month');
  });

  it('should navigate to duplicates with correct relative route', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    fixture.detectChanges();
    component.navigateToDuplicates();

    expect(navigateSpy).toHaveBeenCalledWith(['duplicates'], { relativeTo: expect.any(Object) });
  });
});
