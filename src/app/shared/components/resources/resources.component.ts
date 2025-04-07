import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TabOption } from '@shared/entities/tab-option.interface';
import { Resource } from '@osf/features/search/models/resource.entity';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { ResourceType } from '@osf/features/search/models/resource-type.enum';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourceFiltersComponent } from '@shared/components/resources/resource-filters/resource-filters.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { ResourceCardComponent } from '@shared/components/resources/resource-card/resource-card.component';
import { ResourceFiltersSelectors } from '@shared/components/resources/resource-filters/store/resource-filters.selectors';
import { Store } from '@ngxs/store';
import { ResourceTab } from '@osf/features/search/models/resource-tab.enum';

@Component({
  selector: 'osf-resources',
  imports: [
    DropdownModule,
    FormsModule,
    ResourceFiltersComponent,
    ReactiveFormsModule,
    AutoCompleteModule,
    AccordionModule,
    TableModule,
    DataViewModule,
    ResourceCardComponent,
  ],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesComponent {
  selectedTab = input.required<ResourceTab>();
  searchedResources = input.required<Resource[]>();
  protected readonly filteredResources = computed(() => {
    return this.searchedResources().filter((resources) => {
      switch (this.selectedTab()) {
        case ResourceTab.Projects:
          return (
            resources.resourceType === ResourceType.Project ||
            resources.resourceType === ResourceType.ProjectComponent
          );
        case ResourceTab.Registrations:
          return resources.resourceType === ResourceType.Registration;
        case ResourceTab.Preprints:
          return resources.resourceType === ResourceType.Preprint;
        case ResourceTab.Files:
          return resources.resourceType === ResourceType.File;
        case ResourceTab.Users:
          return resources.resourceType === ResourceType.User;
        default:
          return true;
      }
    });
  });

  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  defaultTabValue = 0;

  protected selectedSortTab = this.defaultTabValue;
  protected readonly sortTabOptions: TabOption[] = [
    { label: 'Relevance', value: 0 },
    { label: 'Date created (newest)', value: 1 },
    { label: 'Date created (oldest)', value: 2 },
    { label: 'Date modified (newest)', value: 3 },
    { label: 'Date modified (oldest)', value: 4 },
  ];

  readonly #store = inject(Store);
  protected readonly creator = this.#store.selectSignal(
    ResourceFiltersSelectors.getCreator,
  );
}
