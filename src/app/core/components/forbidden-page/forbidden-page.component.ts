import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-forbidden-page',
  imports: [TranslatePipe],
  templateUrl: './forbidden-page.component.html',
  styleUrl: './forbidden-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForbiddenPageComponent {
  readonly supportEmail = environment.supportEmail;
}
