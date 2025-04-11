import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
} from 'primeng/accordion';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { CreatorsFilterComponent } from '@shared/components/resources/resource-filters/filters/creators/creators-filter.component';

@Component({
  selector: 'osf-resource-filters',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    AutoComplete,
    AutoCompleteModule,
    ReactiveFormsModule,
    CreatorsFilterComponent,
  ],
  templateUrl: './resource-filters.component.html',
  styleUrl: './resource-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceFiltersComponent {}
