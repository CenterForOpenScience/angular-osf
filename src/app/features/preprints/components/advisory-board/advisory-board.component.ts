import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StringOrNullOrUndefined } from '@osf/shared/helpers';
import { Brand } from '@shared/models';

@Component({
  selector: 'osf-advisory-board',
  imports: [NgClass],
  templateUrl: './advisory-board.component.html',
  styleUrl: './advisory-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvisoryBoardComponent {
  htmlContent = input<StringOrNullOrUndefined>(null);
  brand = input<Brand>();
  isLandingPage = input<boolean>(false);
}
