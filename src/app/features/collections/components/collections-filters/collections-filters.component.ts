import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { MultiSelect, MultiSelectChangeEvent } from 'primeng/multiselect';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CollectionsSelectors } from '@osf/features/collections/store';
import { SetCollectedTypeFilters, SetProgramAreaFilters } from '@osf/features/collections/store/collections.actions';

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
  protected programAreaFilterOptions = [
    { label: 'Public Policy', value: 'Public Policy' },
    { label: 'Child Welfare', value: 'Child Welfare' },
    { label: 'Criminal Justice', value: 'Criminal Justice' },
    { label: 'Medicine', value: 'Medicine' },
    { label: 'Public Health', value: 'Public Health' },
    { label: 'Social Work', value: 'Social Work' },
    { label: 'Nursing', value: 'Nursing' },
    { label: 'Education', value: 'Education' },
    { label: 'Law & Jurisprudence', value: 'Law & Jurisprudence' },
    { label: 'N/A', value: 'N/A' },
  ];

  protected collectedTypeFilterOptions = [
    { label: 'Experiments', value: 'Experiments' },
    { label: 'Interviews', value: 'Interviews' },
    { label: 'Grounded Theory', value: 'Grounded Theory' },
    { label: 'Action Research', value: 'Action Research' },
    { label: 'Case Studies', value: 'Case Studies' },
    { label: 'Direct Observation', value: 'Direct Observation' },
    { label: 'Document Analysis', value: 'Document Analysis' },
    { label: 'Interpretive Research', value: 'Interpretive Research' },
    { label: 'Participatory Action Research', value: 'Participatory Action Research' },
    { label: 'Event-Sampling', value: 'Event-Sampling' },
    { label: 'Surveys', value: 'Surveys' },
    { label: 'Quasi-Experiments', value: 'Quasi-Experiments' },
    { label: 'Ethnography', value: 'Ethnography' },
    { label: 'Social Network Analysis', value: 'Social Network Analysis' },
    { label: 'Critical Research Methods', value: 'Critical Research Methods' },
    { label: 'Design Research', value: 'Design Research' },
    { label: 'Discourse Analysis', value: 'Discourse Analysis' },
    { label: 'Research Synthesis', value: 'Research Synthesis' },
  ];

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
