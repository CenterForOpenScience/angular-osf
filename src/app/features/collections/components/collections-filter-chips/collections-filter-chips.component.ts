import { select, Store } from '@ngxs/store';

import { PrimeTemplate } from 'primeng/api';
import { Chip } from 'primeng/chip';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CollectionsSelectors, SetCollectedTypeFilters, SetProgramAreaFilters } from '@osf/features/collections/store';

@Component({
  selector: 'osf-collections-filter-chips',
  imports: [Chip, PrimeTemplate],
  templateUrl: './collections-filter-chips.component.html',
  styleUrl: './collections-filter-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsFilterChipsComponent {
  protected activeFilters = select(CollectionsSelectors.getAllFilters);

  constructor(private store: Store) {}

  protected onRemoveProgramAreaFilter(removedFilter: string): void {
    const currentFilters = this.activeFilters().programArea.filter((filter) => filter !== removedFilter);
    this.store.dispatch(new SetProgramAreaFilters(currentFilters));
  }

  protected onRemoveCollectedTypeFilter(removedFilter: string): void {
    const currentFilters = this.activeFilters().collectedType.filter((filter) => filter !== removedFilter);
    this.store.dispatch(new SetCollectedTypeFilters(currentFilters));
  }
}
