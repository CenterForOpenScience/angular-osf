import { Store } from '@ngxs/store';

import { Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SearchSelectors } from '@osf/features/search/store/search.selectors';
import { FiltersOptionsService } from '@osf/shared/services/filters-options.service';
import { Creator } from '@shared/entities/filters/creator/creator.entity';
import { DateCreated } from '@shared/entities/filters/dateCreated/date-created.entity';
import { FunderFilter } from '@shared/entities/filters/funder/funder-filter.entity';
import { LicenseFilter } from '@shared/entities/filters/license/license-filter.entity';
import { PartOfCollectionFilter } from '@shared/entities/filters/part-of-collection/part-of-collection-filter.entity';
import { ProviderFilter } from '@shared/entities/filters/provider/provider-filter.entity';
import { ResourceTypeFilter } from '@shared/entities/filters/resource-type/resource-type.entity';
import { SubjectFilter } from '@shared/entities/filters/subject/subject-filter.entity';
import { addFiltersParams } from '@shared/utils/add-filters-params.helper';
import { getResourceTypes } from '@shared/utils/get-resource-types.helper';

import { ResourceFiltersSelectors } from '../store/resource-filters.selectors';

@Injectable({
  providedIn: 'root',
})
export class ResourceFiltersService {
  #store = inject(Store);
  #filtersOptions = inject(FiltersOptionsService);

  #getFilterParams(): Record<string, string> {
    return addFiltersParams(this.#store.selectSignal(ResourceFiltersSelectors.getAllFilters)());
  }

  #getParams(): Record<string, string> {
    const params: Record<string, string> = {};
    const resourceTab = this.#store.selectSnapshot(SearchSelectors.getResourceTab);
    const resourceTypes = getResourceTypes(resourceTab);
    const searchText = this.#store.selectSnapshot(SearchSelectors.getSearchText);
    const sort = this.#store.selectSnapshot(SearchSelectors.getSortBy);

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

  getFunders(): Observable<FunderFilter[]> {
    return this.#filtersOptions.getFunders(this.#getParams(), this.#getFilterParams());
  }

  getSubjects(): Observable<SubjectFilter[]> {
    return this.#filtersOptions.getSubjects(this.#getParams(), this.#getFilterParams());
  }

  getLicenses(): Observable<LicenseFilter[]> {
    return this.#filtersOptions.getLicenses(this.#getParams(), this.#getFilterParams());
  }

  getResourceTypes(): Observable<ResourceTypeFilter[]> {
    return this.#filtersOptions.getResourceTypes(this.#getParams(), this.#getFilterParams());
  }

  getInstitutions(): Observable<ResourceTypeFilter[]> {
    return this.#filtersOptions.getInstitutions(this.#getParams(), this.#getFilterParams());
  }

  getProviders(): Observable<ProviderFilter[]> {
    return this.#filtersOptions.getProviders(this.#getParams(), this.#getFilterParams());
  }

  getPartOtCollections(): Observable<PartOfCollectionFilter[]> {
    return this.#filtersOptions.getPartOtCollections(this.#getParams(), this.#getFilterParams());
  }
}
