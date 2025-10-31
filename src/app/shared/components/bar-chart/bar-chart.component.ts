import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ChartModule } from 'primeng/chart';

import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';

import { PIE_CHART_PALETTE } from '@osf/shared/constants/pie-chart-palette';
import { DatasetInput } from '@shared/models/charts/dataset-input';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'osf-bar-chart',
  imports: [
    ChartModule,
    TranslatePipe,
    LoadingSpinnerComponent,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    Accordion,
  ],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements OnInit {
  isLoading = input<boolean>(false);
  title = input<string>('');
  labels = input<string[]>([]);
  datasets = input<DatasetInput[]>([]);
  showLegend = input<boolean>(false);
  showGrid = input<boolean>(false);
  showTicks = input<boolean>(true);

  orientation = input<'horizontal' | 'vertical'>('horizontal');
  showExpandedSection = input<boolean>(false);

  options = signal<ChartOptions | null>(null);
  data = signal<ChartData | null>(null);

  platformId = inject(PLATFORM_ID);
  readonly PIE_CHART_PALETTE = PIE_CHART_PALETTE;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColorSecondary = documentStyle.getPropertyValue('--dark-blue-1');
      const surfaceBorder = documentStyle.getPropertyValue('--grey-2');
      const defaultBackgroundColor = documentStyle.getPropertyValue('--pr-blue-1');
      const defaultBorderColor = documentStyle.getPropertyValue('--pr-blue-1');

      this.setChartData(defaultBackgroundColor, defaultBorderColor);
      this.setChartOptions(textColorSecondary, surfaceBorder);
    }
  }

  private setChartData(defaultBackgroundColor: string, defaultBorderColor: string) {
    const chartDatasets = this.datasets().map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.color || defaultBackgroundColor,
      borderColor: dataset.color || defaultBorderColor,
    }));

    this.data.set({
      labels: this.labels(),
      datasets: chartDatasets,
    });
  }

  private setChartOptions(textColorSecondary: string, surfaceBorder: string) {
    this.options.set({
      indexAxis: this.orientation() === 'horizontal' ? 'y' : 'x',
      maintainAspectRatio: false,
      aspectRatio: 0.9,
      responsive: true,
      plugins: {
        legend: {
          display: this.showLegend(),
          position: 'top',
        },
      },
      scales: {
        x: {
          ticks: {
            display: this.showTicks(),
            color: textColorSecondary,
          },
          grid: {
            display: this.showGrid(),
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            display: this.showTicks(),
            color: textColorSecondary,
          },
          grid: {
            display: this.showGrid(),
            color: surfaceBorder,
          },
        },
      },
    });
  }
}
