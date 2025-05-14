import { Store } from '@ngxs/store';

import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ApiData, JsonApiResponse } from '@core/services/json-api/json-api.entity';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { SearchSelectors } from '@osf/features/search/store';
import { getResourceTypes } from '@osf/features/search/utils/helpers/get-resource-types.helper';
import { MapCreators } from '@shared/components/resources/resource-filters/mappers/creators/creators.mappers';
import { MapDateCreated } from '@shared/components/resources/resource-filters/mappers/dateCreated/date-created.mapper';
import { MapFunders } from '@shared/components/resources/resource-filters/mappers/funder/funder.mapper';
import { MapInstitutions } from '@shared/components/resources/resource-filters/mappers/institution/institution.mapper';
import { MapLicenses } from '@shared/components/resources/resource-filters/mappers/license/license.mapper';
import { MapPartOfCollections } from '@shared/components/resources/resource-filters/mappers/part-of-collection/part-of-collection.mapper';
import { MapProviders } from '@shared/components/resources/resource-filters/mappers/provider/provider.mapper';
import { MapResourceType } from '@shared/components/resources/resource-filters/mappers/resource-type/resource-type.mapper';
import { MapSubject } from '@shared/components/resources/resource-filters/mappers/subject/subject.mapper';
import { Creator } from '@shared/components/resources/resource-filters/models/creator/creator.entity';
import { CreatorItem } from '@shared/components/resources/resource-filters/models/creator/creator-item.entity';
import { DateCreated } from '@shared/components/resources/resource-filters/models/dateCreated/date-created.entity';
import { FunderFilter } from '@shared/components/resources/resource-filters/models/funder/funder-filter.entity';
import { FunderIndexValueSearch } from '@shared/components/resources/resource-filters/models/funder/funder-index-value-search.entity';
import { IndexValueSearch } from '@shared/components/resources/resource-filters/models/index-value-search.entity';
import { InstitutionIndexValueSearch } from '@shared/components/resources/resource-filters/models/institution/institution-index-value-search.entity';
import { LicenseFilter } from '@shared/components/resources/resource-filters/models/license/license-filter.entity';
import { LicenseIndexValueSearch } from '@shared/components/resources/resource-filters/models/license/license-index-value-search.entity';
import { PartOfCollectionFilter } from '@shared/components/resources/resource-filters/models/part-of-collection/part-of-collection-filter.entity';
import { PartOfCollectionIndexValueSearch } from '@shared/components/resources/resource-filters/models/part-of-collection/part-of-collection-index-value-search.entity';
import { ProviderFilter } from '@shared/components/resources/resource-filters/models/provider/provider-filter.entity';
import { ProviderIndexValueSearch } from '@shared/components/resources/resource-filters/models/provider/provider-index-value-search.entity';
import { ResourceTypeFilter } from '@shared/components/resources/resource-filters/models/resource-type/resource-type.entity';
import { ResourceTypeIndexValueSearch } from '@shared/components/resources/resource-filters/models/resource-type/resource-type-index-value-search.entity';
import { SubjectFilter } from '@shared/components/resources/resource-filters/models/subject/subject-filter.entity';
import { ResourceFiltersSelectors } from '@shared/components/resources/resource-filters/store';
import { addFiltersParams } from '@shared/components/resources/resource-filters/utils/add-filters-params.helper';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResourceFiltersService {
  #jsonApiService = inject(JsonApiService);
  #store = inject(Store);

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
    const dynamicParams = {
      valueSearchPropertyPath: 'creator',
      valueSearchText,
    };

    const fullParams = {
      ...this.#getParams(),
      ...this.#getFilterParams(),
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, ApiData<{ resourceMetadata: CreatorItem }, null, null>[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(
        map((response) => {
          const included = (response?.included ?? []) as ApiData<{ resourceMetadata: CreatorItem }, null, null>[];
          return included
            .filter((item) => item.type === 'index-card')
            .map((item) => MapCreators(item.attributes.resourceMetadata));
        })
      );
  }

  getDates(): Observable<DateCreated[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'dateCreated',
    };

    const fullParams = {
      ...this.#getParams(),
      ...this.#getFilterParams(),
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<JsonApiResponse<null, IndexValueSearch[]>>(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapDateCreated(response?.included ?? [])));
  }

  getFunders(): Observable<FunderFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'funder',
    };

    const fullParams = {
      ...this.#getParams(),
      ...this.#getFilterParams(),
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, FunderIndexValueSearch[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapFunders(response?.included ?? [])));
  }

  getSubjects(): Observable<SubjectFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'subject',
    };

    const fullParams = {
      ...this.#getParams(),
      ...this.#getFilterParams(),
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<JsonApiResponse<null, IndexValueSearch[]>>(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapSubject(response?.included ?? [])));
  }

  getLicenses(): Observable<LicenseFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'rights',
    };

    const fullParams = {
      ...this.#getParams(),
      ...this.#getFilterParams(),
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, LicenseIndexValueSearch[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapLicenses(response?.included ?? [])));
  }

  getResourceTypes(): Observable<ResourceTypeFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'resourceNature',
    };

    const fullParams = {
      ...this.#getParams(),
      ...this.#getFilterParams(),
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, ResourceTypeIndexValueSearch[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapResourceType(response?.included ?? [])));
  }

  getInstitutions(): Observable<ResourceTypeFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'affiliation',
    };

    const fullParams = {
      ...this.#getParams(),
      ...this.#getFilterParams(),
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, InstitutionIndexValueSearch[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapInstitutions(response?.included ?? [])));
  }

  getProviders(): Observable<ProviderFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'publisher',
    };

    const fullParams = {
      ...this.#getParams(),
      ...this.#getFilterParams(),
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, ProviderIndexValueSearch[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapProviders(response?.included ?? [])));
  }

  getPartOtCollections(): Observable<PartOfCollectionFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'isPartOfCollection',
    };

    const fullParams = {
      ...this.#getParams(),
      ...this.#getFilterParams(),
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, PartOfCollectionIndexValueSearch[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapPartOfCollections(response?.included ?? [])));
  }
}
