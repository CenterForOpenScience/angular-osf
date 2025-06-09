import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'osf-forbidden-page',
  imports: [TranslatePipe],
  templateUrl: './forbidden-page.component.html',
  styleUrl: './forbidden-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForbiddenPageComponent {}
