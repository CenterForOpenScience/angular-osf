import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { MultiSelect, MultiSelectChangeEvent } from 'primeng/multiselect';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CollectionsSelectors, SetCollectedTypeFilters, SetProgramAreaFilters } from '@osf/features/collections/store';
import { COLLECTED_TYPE_FILTERS_OPTIONS, PROGRAM_AREA_FILTERS_OPTIONS } from '@osf/features/collections/utils';

@Component({
  selector: 'osf-collections-filters',
  imports: [FormsModule, MultiSelect, Accordion, AccordionContent, AccordionHeader, AccordionPanel, TranslatePipe],
  templateUrl: './collections-filters.component.html',
  styleUrl: './collections-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsFiltersComponent {
  protected selectedProgramAreaFilters = select(CollectionsSelectors.getProgramAreaFilters);
  protected selectedCollectedTypeFilters = select(CollectionsSelectors.getCollectedTypeFilters);
  protected actions = createDispatchMap({
    setProgramAreaFilters: SetProgramAreaFilters,
    setCollectedTypeFilters: SetCollectedTypeFilters,
  });

  // Mocked filter options data
  protected readonly programAreaFilterOptions = PROGRAM_AREA_FILTERS_OPTIONS;
  protected readonly collectedTypeFilterOptions = COLLECTED_TYPE_FILTERS_OPTIONS;

  setProgramAreaFilters($event: MultiSelectChangeEvent): void {
    const filters = $event.value;
    this.actions.setProgramAreaFilters(filters);
  }

  setCollectedTypeFilters($event: MultiSelectChangeEvent): void {
    const filters = $event.value;
    this.actions.setCollectedTypeFilters(filters);
  }

  clearProgramAreaFilters(): void {
    this.actions.setProgramAreaFilters([]);
  }

  clearCollectedTypeFilters(): void {
    this.actions.setCollectedTypeFilters([]);
  }
}
