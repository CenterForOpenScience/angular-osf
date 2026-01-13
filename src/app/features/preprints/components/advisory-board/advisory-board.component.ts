import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StringOrNullOrUndefined } from '@osf/shared/helpers/types.helper';
import { BrandModel } from '@osf/shared/models/brand/brand.model';
import { SafeHtmlPipe } from '@osf/shared/pipes/safe-html.pipe';

@Component({
  selector: 'osf-advisory-board',
  imports: [NgClass, SafeHtmlPipe],
  templateUrl: './advisory-board.component.html',
  styleUrl: './advisory-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvisoryBoardComponent {
  htmlContent = input<StringOrNullOrUndefined>(null);
  brand = input<BrandModel>();
  isLandingPage = input<boolean>(false);
}
