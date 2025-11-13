import { ProgressSpinner } from 'primeng/progressspinner';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LoaderService } from '@osf/shared/services/loader.service';

@Component({
  selector: 'osf-full-screen-loader',
  imports: [ProgressSpinner],
  templateUrl: './full-screen-loader.component.html',
  styleUrl: './full-screen-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullScreenLoaderComponent {
  loaderService = inject(LoaderService);
}
