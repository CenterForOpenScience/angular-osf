import { Paginator, PaginatorState } from 'primeng/paginator';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'osf-custom-paginator',
  imports: [Paginator],
  templateUrl: './custom-paginator.component.html',
  styleUrl: './custom-paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPaginatorComponent {
  first = input<number>(0);
  rows = input<number>(10);
  totalCount = input<number>(0);
  showFirstLastIcon = input<boolean>(false);

  pageChanged = output<PaginatorState>();
}
