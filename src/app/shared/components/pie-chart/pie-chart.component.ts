import { TranslatePipe } from '@ngx-translate/core';

import { ChartModule } from 'primeng/chart';

import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { PIE_CHART_PALETTE } from '@osf/shared/helpers/pie-chart-palette';
import { DatasetInput } from '@osf/shared/models';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'osf-pie-chart',
  imports: [ChartModule, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent implements OnInit {
  isLoading = input<boolean>(false);
  title = input<string>('');
  labels = input<string[]>([]);
  datasets = input<DatasetInput[]>([]);
  showLegend = input<boolean>(false);

  protected options = signal<ChartOptions>({});
  protected data = signal<ChartData>({} as ChartData);

  #platformId = inject(PLATFORM_ID);
  #cd = inject(ChangeDetectorRef);

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    if (isPlatformBrowser(this.#platformId)) {
      this.setChartData();
      this.setChartOptions();

      this.#cd.markForCheck();
    }
  }

  private setChartData() {
    const chartDatasets = this.datasets().map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: PIE_CHART_PALETTE,
      borderWidth: 0,
    }));

    this.data.set({
      labels: this.labels(),
      datasets: chartDatasets,
    });
  }

  private setChartOptions() {
    this.options.set({
      maintainAspectRatio: true,
      responsive: true,
      plugins: {
        legend: {
          display: this.showLegend(),
          position: 'bottom',
        },
      },
    });
  }
}
