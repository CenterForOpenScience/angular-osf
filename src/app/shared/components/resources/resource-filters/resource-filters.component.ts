import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
} from '@angular/core';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
} from 'primeng/accordion';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { Store } from '@ngxs/store';
import { SetCreator } from '@shared/components/resources/resource-filters/store/resource-filters.actions';

@Component({
  selector: 'osf-resource-filters',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    AutoComplete,
    AutoCompleteModule,
  ],
  templateUrl: './resource-filters.component.html',
  styleUrl: './resource-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceFiltersComponent {
  readonly #store = inject(Store);

  creator = model<string>('');
  creators: string[] = [];
  filteredCreators = computed(() => {
    return this.creators.filter((creator) =>
      creator.toLowerCase().includes(this.creator().toLowerCase()),
    );
  });

  setCreator(event: AutoCompleteCompleteEvent) {
    this.#store.dispatch(new SetCreator(event.query));
  }
}
