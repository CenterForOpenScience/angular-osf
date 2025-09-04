import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GlobalSearchComponent } from '@shared/components';
import { SEARCH_TAB_OPTIONS } from '@shared/constants';

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
