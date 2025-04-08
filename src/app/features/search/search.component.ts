import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { ResourcesComponent } from '@shared/components/resources/resources.component';
import { ResourceTab } from '@osf/features/search/models/resource-tab.enum';
import { Resource } from '@osf/features/search/models/resource.entity';
import { resources } from '@osf/features/search/data';

@Component({
  selector: 'osf-search',
  imports: [
    SearchInputComponent,
    DropdownModule,
    ReactiveFormsModule,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    NgOptimizedImage,
    AutoCompleteModule,
    FormsModule,
    AccordionModule,
    TableModule,
    DataViewModule,
    ResourcesComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  protected searchValue = signal('');
  protected selectedTab = 0;
  protected readonly isMobile = toSignal(inject(IS_XSMALL));

  protected readonly resources = signal<Resource[]>(resources);
  protected readonly searchedResources = computed(() => {
    const search = this.searchValue().toLowerCase();
    return this.resources().filter(
      (resource: Resource) =>
        resource.title?.toLowerCase().includes(search) ||
        resource.fileName?.toLowerCase().includes(search) ||
        resource.description?.toLowerCase().includes(search) ||
        resource.creators
          ?.map((p) => p.name.toLowerCase())
          .some((name) => name.includes(search)) ||
        resource.dateCreated
          ?.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
          .toLowerCase()
          .includes(search) ||
        resource.dateModified
          ?.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
          .toLowerCase()
          .includes(search) ||
        resource.from?.name.toLowerCase().includes(search),
    );
  });

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  protected readonly ResourceTab = ResourceTab;
}
