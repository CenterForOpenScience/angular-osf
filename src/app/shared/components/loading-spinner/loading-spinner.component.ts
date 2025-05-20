import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'osf-loading-spinner',
  imports: [ProgressSpinnerModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {}
