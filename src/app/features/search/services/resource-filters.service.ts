import { Store } from '@ngxs/store';

import { Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import {
  Creator,
  DateCreated,
  FunderFilter,
  LicenseFilter,
  PartOfCollectionFilter,
  ProviderFilter,
  ResourceTypeFilter,
  SubjectFilter,
} from '@osf/shared/models';
import { FiltersOptionsService } from '@osf/shared/services';
import { addFiltersParams, getResourceTypes } from '@osf/shared/utils';

import { ResourceFiltersSelectors } from '../components/resource-filters/store';
import { SearchSelectors } from '../store';

@Injectable({
  providedIn: 'root',
})
export class ResourceFiltersService {
  store = inject(Store);
  filtersOptions = inject(FiltersOptionsService);

  getFilterParams(): Record<string, string> {
    return addFiltersParams(this.store.selectSignal(ResourceFiltersSelectors.getAllFilters)());
  }

  getParams(): Record<string, string> {
    const params: Record<string, string> = {};
    const resourceTab = this.store.selectSnapshot(SearchSelectors.getResourceTab);
    const resourceTypes = getResourceTypes(resourceTab);
    const searchText = this.store.selectSnapshot(SearchSelectors.getSearchText);
    const sort = this.store.selectSnapshot(SearchSelectors.getSortBy);

    params['cardSearchFilter[resourceType]'] = resourceTypes;
    params['cardSearchFilter[accessService]'] = 'https://staging4.osf.io/';
    params['cardSearchText[*,creator.name,isContainedBy.creator.name]'] = searchText;
    params['page[size]'] = '10';
    params['sort'] = sort;
    return params;
  }

  getCreators(valueSearchText: string): Observable<Creator[]> {
    return this.filtersOptions.getCreators(valueSearchText, this.getParams(), this.getFilterParams());
  }

  getDates(): Observable<DateCreated[]> {
    return this.filtersOptions.getDates(this.getParams(), this.getFilterParams());
  }

  getFunders(): Observable<FunderFilter[]> {
    return this.filtersOptions.getFunders(this.getParams(), this.getFilterParams());
  }

  getSubjects(): Observable<SubjectFilter[]> {
    return this.filtersOptions.getSubjects(this.getParams(), this.getFilterParams());
  }

  getLicenses(): Observable<LicenseFilter[]> {
    return this.filtersOptions.getLicenses(this.getParams(), this.getFilterParams());
  }

  getResourceTypes(): Observable<ResourceTypeFilter[]> {
    return this.filtersOptions.getResourceTypes(this.getParams(), this.getFilterParams());
  }

  getInstitutions(): Observable<ResourceTypeFilter[]> {
    return this.filtersOptions.getInstitutions(this.getParams(), this.getFilterParams());
  }

  getProviders(): Observable<ProviderFilter[]> {
    return this.filtersOptions.getProviders(this.getParams(), this.getFilterParams());
  }

  getPartOtCollections(): Observable<PartOfCollectionFilter[]> {
    return this.filtersOptions.getPartOtCollections(this.getParams(), this.getFilterParams());
  }
}
