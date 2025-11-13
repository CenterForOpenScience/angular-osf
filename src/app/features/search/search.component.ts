import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { SEARCH_TAB_OPTIONS } from '@osf/shared/constants/search-tab-options.const';

@Component({
  selector: 'osf-search-page',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GlobalSearchComponent],
})
export class SearchComponent {
  searchTabOptions = SEARCH_TAB_OPTIONS;
}
