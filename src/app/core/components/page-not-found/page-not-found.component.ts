import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { PAGE_NOT_FOUND_ROUTE_DATA } from '../../constants/page-not-found.constants';

@Component({
  selector: 'osf-page-not-found',
  imports: [TranslatePipe],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {
  private readonly environment = inject(ENVIRONMENT);
  private readonly route = inject(ActivatedRoute);

  readonly supportEmail = this.environment.supportEmail;
  readonly titleKey = this.route.snapshot.data['titleKey'] ?? PAGE_NOT_FOUND_ROUTE_DATA.titleKey;
  readonly messageKey = this.route.snapshot.data['messageKey'] ?? PAGE_NOT_FOUND_ROUTE_DATA.messageKey;
}
