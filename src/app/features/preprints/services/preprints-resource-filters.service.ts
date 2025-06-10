import { select, Store } from '@ngxs/store';

import { Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { PreprintsResourcesFiltersSelectors } from '@osf/features/preprints/store/preprints-resources-filters';
import { PreprintsSearchSelectors } from '@osf/features/preprints/store/preprints-search';
import { ResourceFiltersStateModel } from '@osf/features/search/components/resource-filters/store';
import { Creator, DateCreated, LicenseFilter, ProviderFilter, SubjectFilter } from '@osf/shared/models';
import { FiltersOptionsService } from '@osf/shared/services';
import { addFiltersParams, getResourceTypes } from '@osf/shared/utils';
import { ResourceTab } from '@shared/enums';

@Injectable({
  providedIn: 'root',
})
export class PreprintsFiltersOptionsService {
  #store = inject(Store);
  #filtersOptions = inject(FiltersOptionsService);

  #getFilterParams(): Record<string, string> {
    return addFiltersParams(select(PreprintsResourcesFiltersSelectors.getAllFilters)() as ResourceFiltersStateModel);
  }

  #getParams(): Record<string, string> {
    const params: Record<string, string> = {};
    const resourceTab = ResourceTab.Preprints;
    const resourceTypes = getResourceTypes(resourceTab);
    const searchText = this.#store.selectSnapshot(PreprintsSearchSelectors.getSearchText);
    const sort = this.#store.selectSnapshot(PreprintsSearchSelectors.getSortBy);

    params['cardSearchFilter[resourceType]'] = resourceTypes;
    params['cardSearchFilter[accessService]'] = 'https://staging4.osf.io/';
    params['cardSearchText[*,creator.name,isContainedBy.creator.name]'] = searchText;
    params['page[size]'] = '10';
    params['sort'] = sort;
    return params;
  }

  getCreators(valueSearchText: string): Observable<Creator[]> {
    return this.#filtersOptions.getCreators(valueSearchText, this.#getParams(), this.#getFilterParams());
  }

  getDates(): Observable<DateCreated[]> {
    return this.#filtersOptions.getDates(this.#getParams(), this.#getFilterParams());
  }

  getSubjects(): Observable<SubjectFilter[]> {
    return this.#filtersOptions.getSubjects(this.#getParams(), this.#getFilterParams());
  }

  getLicenses(): Observable<LicenseFilter[]> {
    return this.#filtersOptions.getLicenses(this.#getParams(), this.#getFilterParams());
  }

  getProviders(): Observable<ProviderFilter[]> {
    return this.#filtersOptions.getProviders(this.#getParams(), this.#getFilterParams());
  }
}
