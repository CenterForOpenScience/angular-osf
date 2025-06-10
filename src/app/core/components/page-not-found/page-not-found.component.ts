import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'osf-page-not-found',
  imports: [TranslatePipe],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {}
