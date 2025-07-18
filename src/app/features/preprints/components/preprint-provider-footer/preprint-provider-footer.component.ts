import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StringOrNullOrUndefined } from '@core/helpers';

@Component({
  selector: 'osf-preprint-provider-footer',
  imports: [],
  templateUrl: './preprint-provider-footer.component.html',
  styleUrl: './preprint-provider-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintProviderFooterComponent {
  footerHtml = input.required<StringOrNullOrUndefined>();
}
