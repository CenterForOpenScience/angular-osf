import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { SelectModule } from 'primeng/select';

import { map, of } from 'rxjs';

import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BarChartComponent, LineChartComponent, PieChartComponent, SubHeaderComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { hasViewOnlyParam, IS_WEB } from '@osf/shared/helpers';
import { DatasetInput } from '@osf/shared/models';
import { ViewOnlyLinkMessageComponent } from '@shared/components/view-only-link-message/view-only-link-message.component';

import { AnalyticsKpiComponent } from './components';
import { DATE_RANGE_OPTIONS } from './constants';
import { DateRangeOption } from './models';
import { AnalyticsSelectors, ClearAnalytics, GetMetrics, GetRelatedCounts } from './store';

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
    ViewOnlyLinkMessageComponent,
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class AnalyticsComponent implements OnInit {
  rangeOptions = DATE_RANGE_OPTIONS;
  selectedRange = signal(DATE_RANGE_OPTIONS[0]);

  readonly IS_X_LARGE = toSignal(inject(IS_WEB));

  private readonly datePipe = inject(DatePipe);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly resourceId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));
  readonly resourceType: Signal<ResourceType | undefined> = toSignal(
    this.route.data.pipe(map((params) => params['resourceType'])) ?? of(undefined)
  );

  hasViewOnly = computed(() => {
    return hasViewOnlyParam(this.router);
  });

  analytics = select(AnalyticsSelectors.getMetrics(this.resourceId()));
  relatedCounts = select(AnalyticsSelectors.getRelatedCounts(this.resourceId()));

  isMetricsLoading = select(AnalyticsSelectors.isMetricsLoading);
  isRelatedCountsLoading = select(AnalyticsSelectors.isRelatedCountsLoading);

  isMetricsError = select(AnalyticsSelectors.isMetricsError);

  actions = createDispatchMap({
    getMetrics: GetMetrics,
    getRelatedCounts: GetRelatedCounts,
    clearAnalytics: ClearAnalytics,
  });

  visitsLabels: string[] = [];
  visitsDataset: DatasetInput[] = [];

  totalVisitsLabels: string[] = [];
  totalVisitsDataset: DatasetInput[] = [];

  topReferrersLabels: string[] = [];
  topReferrersDataset: DatasetInput[] = [];

  popularPagesLabels: string[] = [];
  popularPagesDataset: DatasetInput[] = [];

  ngOnInit() {
    this.actions.getMetrics(this.resourceId(), this.selectedRange().value);
    this.actions.getRelatedCounts(this.resourceId(), this.resourceType());
    this.setData();
  }

  constructor() {
    this.setupCleanup();
  }

  setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.actions.clearAnalytics();
    });
  }

  onRangeChange(range: DateRangeOption) {
    this.selectedRange.set(range);
    this.actions.getMetrics(this.resourceId(), range.value);
  }

  private setData() {
    const analytics = this.analytics();

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

  navigateToDuplicates() {
    this.router.navigate(['duplicates'], { relativeTo: this.route });
  }
}
