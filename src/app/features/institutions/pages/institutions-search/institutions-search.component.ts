import { createDispatchMap, select } from '@ngxs/store';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { Paginator } from 'primeng/paginator';
import { Tabs, TabsModule } from 'primeng/tabs';

import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SidenavComponent } from '@osf/core/components';
import { BreadcrumbComponent } from '@osf/core/components/breadcrumb/breadcrumb.component';
import { ReusableFilterComponent } from '@shared/components';
import { ResourceTab } from '@shared/enums';
import { DiscoverableFilter, Resource } from '@shared/models';
import {
  FetchInstitutionById,
  FetchResources,
  FetchResourcesByLink,
  InstitutionsSearchSelectors,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  SetFilterValues,
  UpdateFilterValue,
  UpdateResourceType,
} from '@shared/stores';

@Component({
  selector: 'osf-institutions-search',
  imports: [
    SidenavComponent,
    BreadcrumbComponent,
    ReusableFilterComponent,
    AutoCompleteModule,
    FormsModule,
    Tabs,
    TabsModule,
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    Button,
    Paginator,
    JsonPipe,
  ],
  templateUrl: './institutions-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsSearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  institution = select(InstitutionsSearchSelectors.getInstitution);
  isInstitutionLoading = select(InstitutionsSearchSelectors.getInstitutionLoading);
  resources = select(InstitutionsSearchSelectors.getResources);
  isResourcesLoading = select(InstitutionsSearchSelectors.getResourcesLoading);
  resourcesCount = select(InstitutionsSearchSelectors.getResourcesCount);
  filters = select(InstitutionsSearchSelectors.getFilters);
  selectedValues = select(InstitutionsSearchSelectors.getFilterValues);

  private readonly actions = createDispatchMap({
    fetchInstitution: FetchInstitutionById,
    updateResourceType: UpdateResourceType,
    loadFilterOptions: LoadFilterOptions,
    loadFilterOptionsAndSetValues: LoadFilterOptionsAndSetValues,
    setFilterValues: SetFilterValues,
    updateFilterValue: UpdateFilterValue,
    fetchResourcesByLink: FetchResourcesByLink,
    fetchResources: FetchResources,
  });

  readonly resourceTab = ResourceTab;
  readonly resourceType = select(InstitutionsSearchSelectors.getResourceType);

  ngOnInit(): void {
    this.restoreFiltersFromUrl();

    const institutionId = this.route.snapshot.params['institution-id'];
    if (institutionId) {
      this.actions.fetchInstitution(institutionId);
    }
  }

  private restoreFiltersFromUrl(): void {
    const queryParams = this.route.snapshot.queryParams;
    const filterValues: Record<string, string | null> = {};

    Object.keys(queryParams).forEach((key) => {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '');
        const filterValue = queryParams[key];
        if (filterValue) {
          filterValues[filterKey] = filterValue;
        }
      }
    });

    if (Object.keys(filterValues).length > 0) {
      this.actions.loadFilterOptionsAndSetValues(filterValues);
    }
  }

  private updateUrlWithFilters(filterValues: Record<string, string | null>): void {
    const queryParams: Record<string, string> = { ...this.route.snapshot.queryParams };

    Object.keys(queryParams).forEach((key) => {
      if (key.startsWith('filter_')) {
        delete queryParams[key];
      }
    });

    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams[`filter_${key}`] = value;
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace',
      replaceUrl: true,
    });
  }

  onLoadFilterOptions(event: { filterType: string; filter: DiscoverableFilter }): void {
    this.actions.loadFilterOptions(event.filterType);
  }

  onFilterChanged(event: { filterType: string; value: string | null }): void {
    this.actions.updateFilterValue(event.filterType, event.value);

    const currentFilters = this.selectedValues();
    const updatedFilters = {
      ...currentFilters,
      [event.filterType]: event.value,
    };

    Object.keys(updatedFilters).forEach((key) => {
      if (!updatedFilters[key]) {
        delete updatedFilters[key];
      }
    });

    this.updateUrlWithFilters(updatedFilters);
  }

  onResourceTypeChange(type: ResourceTab): void {
    this.actions.updateResourceType(type);
    this.actions.fetchResources();
  }

  onNextPage(): void {
    const next = select(InstitutionsSearchSelectors.getNext);
    if (next()) {
      this.actions.fetchResourcesByLink(next());
    }
  }

  onPreviousPage(): void {
    const previous = select(InstitutionsSearchSelectors.getPrevious);
    if (previous()) {
      this.actions.fetchResourcesByLink(previous());
    }
  }

  navigateToResource(resource: Resource): void {
    console.log(resource);
    // todo: add in second step
  }
}
