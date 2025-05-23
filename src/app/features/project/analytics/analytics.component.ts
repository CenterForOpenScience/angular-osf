import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { SelectModule } from 'primeng/select';

import { map, of } from 'rxjs';

import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BarChartComponent, LineChartComponent, PieChartComponent } from '@osf/shared/components';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { DatasetInput } from '@osf/shared/models';

import { AnalyticsKpiComponent } from './components/analytics-kpi/analytics-kpi.component';
import { DATE_RANGE_OPTIONS } from './constants/analytics-constants';
import { AnalyticsSelectors } from './store/analytics.selectors';
import { DateRangeOption } from './models';
import { GetMetrics, GetRelatedCounts } from './store';
import { analyticsData } from './test-data';

@Component({
  selector: 'osf-analytics',
  imports: [
    CommonModule,
    FormsModule,
    SubHeaderComponent,
    AnalyticsKpiComponent,
    SelectModule,
    TranslatePipe,
    LineChartComponent,
    PieChartComponent,
    BarChartComponent,
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class AnalyticsComponent implements OnInit {
  protected rangeOptions = DATE_RANGE_OPTIONS;
  protected selectedRange = signal(DATE_RANGE_OPTIONS[0]);

  private readonly datePipe = inject(DatePipe);
  private readonly route = inject(ActivatedRoute);

  readonly projectId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));

  protected analytics = select(AnalyticsSelectors.getMetrics(this.projectId()));
  protected relatedCounts = select(AnalyticsSelectors.getRelatedCounts(this.projectId()));

  protected isMetricsLoading = select(AnalyticsSelectors.isMetricsLoading);
  protected isRelatedCountsLoading = select(AnalyticsSelectors.isRelatedCountsLoading);

  protected isMetricsError = select(AnalyticsSelectors.isMetricsError);

  protected actions = createDispatchMap({ getMetrics: GetMetrics, getRelatedCounts: GetRelatedCounts });

  protected visitsLabels: string[] = [];
  protected visitsDataset: DatasetInput[] = [];

  protected totalVisitsLabels: string[] = [];
  protected totalVisitsDataset: DatasetInput[] = [];

  protected topReferrersLabels: string[] = [];
  protected topReferrersDataset: DatasetInput[] = [];

  protected popularPagesLabels: string[] = [];
  protected popularPagesDataset: DatasetInput[] = [];

  ngOnInit() {
    this.actions.getMetrics(this.projectId(), this.selectedRange().value);
    this.actions.getRelatedCounts(this.projectId());
    this.setData();
  }

  onRangeChange(range: DateRangeOption) {
    this.selectedRange.set(range);
    this.actions.getMetrics(this.projectId(), range.value);
  }

  private setData() {
    const analytics = this.analytics() || analyticsData;

    if (!analytics) {
      return;
    }

    this.visitsLabels = analytics.uniqueVisits.map((item) => this.datePipe.transform(item.date, 'MMM d') || '');
    this.visitsDataset = [{ label: 'Visits', data: analytics.uniqueVisits.map((item) => item.count) }];

    this.totalVisitsLabels = analytics.timeOfDay.map((item) => item.hour.toString());
    this.totalVisitsDataset = [{ label: 'Visits', data: analytics.timeOfDay.map((item) => item.count) }];

    this.topReferrersLabels = analytics.refererDomain.map((item) => item.refererDomain);
    this.topReferrersDataset = [{ label: 'Top referrers', data: analytics.refererDomain.map((item) => item.count) }];

    this.popularPagesLabels = analytics.popularPages.map((item) => item.title);
    this.popularPagesDataset = [{ label: 'Popular pages', data: analytics.popularPages.map((item) => item.count) }];
  }
}
