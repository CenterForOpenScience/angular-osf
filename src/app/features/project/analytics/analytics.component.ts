import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { SelectModule } from 'primeng/select';

import { map, of } from 'rxjs';

import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BarChartComponent, LineChartComponent, PieChartComponent, SubHeaderComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { DatasetInput } from '@osf/shared/models';
import { IS_WEB } from '@osf/shared/utils';

import { AnalyticsKpiComponent } from './components';
import { DATE_RANGE_OPTIONS } from './constants';
import { DateRangeOption } from './models';
import { AnalyticsSelectors, GetMetrics, GetRelatedCounts } from './store';
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

  protected readonly IS_X_LARGE = toSignal(inject(IS_WEB));

  private readonly datePipe = inject(DatePipe);
  private readonly route = inject(ActivatedRoute);

  readonly resourceId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));
  readonly resourceType: Signal<ResourceType | undefined> = toSignal(
    this.route.data.pipe(map((params) => params['resourceType'])) ?? of(undefined)
  );

  protected analytics = select(AnalyticsSelectors.getMetrics(this.resourceId()));
  protected relatedCounts = select(AnalyticsSelectors.getRelatedCounts(this.resourceId()));

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
    this.actions.getMetrics(this.resourceId(), this.selectedRange().value);
    this.actions.getRelatedCounts(this.resourceId(), this.resourceType());
    this.setData();
  }

  onRangeChange(range: DateRangeOption) {
    this.selectedRange.set(range);
    this.actions.getMetrics(this.resourceId(), range.value);
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
