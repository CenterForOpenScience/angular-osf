import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ApiData, JsonApiResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';

import {
  MapCreators,
  MapDateCreated,
  MapFunders,
  MapInstitutions,
  MapLicenses,
  MapPartOfCollections,
  MapProviders,
  MapResourceType,
  MapSubject,
} from '../mappers';
import {
  Creator,
  CreatorItem,
  DateCreated,
  FunderFilter,
  FunderIndexValueSearch,
  IndexValueSearch,
  InstitutionIndexValueSearch,
  LicenseFilter,
  LicenseIndexValueSearch,
  PartOfCollectionFilter,
  PartOfCollectionIndexValueSearch,
  ProviderFilter,
  ProviderIndexValueSearch,
  ResourceTypeFilter,
  ResourceTypeIndexValueSearch,
  SubjectFilter,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FiltersOptionsService {
  #jsonApiService = inject(JsonApiService);

  getCreators(
    valueSearchText: string,
    params: Record<string, string>,
    filterParams: Record<string, string>
  ): Observable<Creator[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'creator',
      valueSearchText,
    };

    const fullParams = {
      ...params,
      ...filterParams,
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, ApiData<{ resourceMetadata: CreatorItem }, null, null, null>[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(
        map((response) => {
          const included = (response?.included ?? []) as ApiData<{ resourceMetadata: CreatorItem }, null, null, null>[];
          return included
            .filter((item) => item.type === 'index-card')
            .map((item) => MapCreators(item.attributes.resourceMetadata));
        })
      );
  }

  getDates(params: Record<string, string>, filterParams: Record<string, string>): Observable<DateCreated[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'dateCreated',
    };

    const fullParams = {
      ...params,
      ...filterParams,
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<JsonApiResponse<null, IndexValueSearch[]>>(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapDateCreated(response?.included ?? [])));
  }

  getFunders(params: Record<string, string>, filterParams: Record<string, string>): Observable<FunderFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'funder',
    };

    const fullParams = {
      ...params,
      ...filterParams,
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, FunderIndexValueSearch[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapFunders(response?.included ?? [])));
  }

  getSubjects(params: Record<string, string>, filterParams: Record<string, string>): Observable<SubjectFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'subject',
    };

    const fullParams = {
      ...params,
      ...filterParams,
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<JsonApiResponse<null, IndexValueSearch[]>>(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapSubject(response?.included ?? [])));
  }

  getLicenses(params: Record<string, string>, filterParams: Record<string, string>): Observable<LicenseFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'rights',
    };

    const fullParams = {
      ...params,
      ...filterParams,
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, LicenseIndexValueSearch[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapLicenses(response?.included ?? [])));
  }

  getResourceTypes(
    params: Record<string, string>,
    filterParams: Record<string, string>
  ): Observable<ResourceTypeFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'resourceNature',
    };

    const fullParams = {
      ...params,
      ...filterParams,
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, ResourceTypeIndexValueSearch[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapResourceType(response?.included ?? [])));
  }

  getInstitutions(
    params: Record<string, string>,
    filterParams: Record<string, string>
  ): Observable<ResourceTypeFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'affiliation',
    };

    const fullParams = {
      ...params,
      ...filterParams,
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, InstitutionIndexValueSearch[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapInstitutions(response?.included ?? [])));
  }

  getProviders(params: Record<string, string>, filterParams: Record<string, string>): Observable<ProviderFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'publisher',
    };

    const fullParams = {
      ...params,
      ...filterParams,
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, ProviderIndexValueSearch[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapProviders(response?.included ?? [])));
  }

  getPartOtCollections(
    params: Record<string, string>,
    filterParams: Record<string, string>
  ): Observable<PartOfCollectionFilter[]> {
    const dynamicParams = {
      valueSearchPropertyPath: 'isPartOfCollection',
    };

    const fullParams = {
      ...params,
      ...filterParams,
      ...dynamicParams,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<null, PartOfCollectionIndexValueSearch[]>
      >(`${environment.shareDomainUrl}/index-value-search`, fullParams)
      .pipe(map((response) => MapPartOfCollections(response?.included ?? [])));
  }
}
