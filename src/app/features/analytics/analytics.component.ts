import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { map, of } from 'rxjs';

import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  BarChartComponent,
  LineChartComponent,
  LoadingSpinnerComponent,
  PieChartComponent,
  SelectComponent,
  SubHeaderComponent,
  ViewOnlyLinkMessageComponent,
} from '@osf/shared/components';
import { hasViewOnlyParam, IS_WEB, Primitive } from '@osf/shared/helpers';
import { DatasetInput } from '@osf/shared/models';

import { AnalyticsKpiComponent } from './components';
import { DATE_RANGE_OPTIONS } from './constants';
import { DateRange } from './enums';
import { AnalyticsSelectors, ClearAnalytics, GetMetrics, GetRelatedCounts } from './store';

@Component({
  selector: 'osf-analytics',
  imports: [
    FormsModule,
    SubHeaderComponent,
    AnalyticsKpiComponent,
    TranslatePipe,
    LineChartComponent,
    PieChartComponent,
    BarChartComponent,
    ViewOnlyLinkMessageComponent,
    SelectComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class AnalyticsComponent implements OnInit {
  rangeOptions = DATE_RANGE_OPTIONS;
  selectedRange = signal(DATE_RANGE_OPTIONS[0].value);

  readonly IS_X_LARGE = toSignal(inject(IS_WEB));

  private readonly datePipe = inject(DatePipe);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);

  readonly resourceId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));
  readonly resourceType = toSignal(this.route.data.pipe(map((params) => params['resourceType'])) ?? of(undefined));

  hasViewOnly = computed(() => hasViewOnlyParam(this.router));

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

  constructor() {
    this.setupCleanup();
    this.setupEffects();
  }

  ngOnInit() {
    this.actions.getRelatedCounts(this.resourceId(), this.resourceType());
  }

  setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.actions.clearAnalytics();
    });
  }

  setupEffects(): void {
    effect(() => {
      const relatedCounts = this.relatedCounts();
      const resourceId = this.resourceId();
      const selectedRange = this.selectedRange();

      if (relatedCounts?.isPublic && resourceId) {
        this.actions.getMetrics(resourceId, selectedRange);
      }
    });

    effect(() => {
      this.setData();
    });
  }

  onRangeChange(value: Primitive) {
    this.selectedRange.set(value as DateRange);
  }

  navigateToDuplicates() {
    this.router.navigate(['duplicates'], { relativeTo: this.route });
  }

  navigateToLinkedProjects() {
    this.router.navigate(['linked-projects'], { relativeTo: this.route });
  }
  private setData() {
    const analytics = this.analytics();

    if (!analytics) {
      return;
    }

    this.visitsLabels = analytics.uniqueVisits.map((item) => this.datePipe.transform(item.date, 'MMM d') || '');
    this.visitsDataset = [
      {
        label: this.translateService.instant('project.analytics.charts.visits'),
        data: analytics.uniqueVisits.map((item) => item.count),
      },
    ];

    this.totalVisitsLabels = analytics.timeOfDay.map((item) => item.hour.toString());
    this.totalVisitsDataset = [
      {
        label: this.translateService.instant('project.analytics.charts.visits'),
        data: analytics.timeOfDay.map((item) => item.count),
      },
    ];

    this.topReferrersLabels = analytics.refererDomain.map((item) => item.refererDomain);
    this.topReferrersDataset = [
      {
        label: this.translateService.instant('project.analytics.charts.topReferrers'),
        data: analytics.refererDomain.map((item) => item.count),
      },
    ];

    this.popularPagesLabels = analytics.popularPages.map((item) => item.title);
    this.popularPagesDataset = [
      {
        label: this.translateService.instant('project.analytics.charts.popularPages'),
        data: analytics.popularPages.map((item) => item.count),
      },
    ];
  }
}
