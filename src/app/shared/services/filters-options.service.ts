import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ApiData, JsonApiResponse } from '@core/services/json-api/json-api.entity';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { Creator } from '@shared/entities/filters/creator/creator.entity';
import { CreatorItem } from '@shared/entities/filters/creator/creator-item.entity';
import { DateCreated } from '@shared/entities/filters/dateCreated/date-created.entity';
import { FunderFilter } from '@shared/entities/filters/funder/funder-filter.entity';
import { FunderIndexValueSearch } from '@shared/entities/filters/funder/funder-index-value-search.entity';
import { IndexValueSearch } from '@shared/entities/filters/index-value-search.entity';
import { InstitutionIndexValueSearch } from '@shared/entities/filters/institution/institution-index-value-search.entity';
import { LicenseFilter } from '@shared/entities/filters/license/license-filter.entity';
import { LicenseIndexValueSearch } from '@shared/entities/filters/license/license-index-value-search.entity';
import { PartOfCollectionFilter } from '@shared/entities/filters/part-of-collection/part-of-collection-filter.entity';
import { PartOfCollectionIndexValueSearch } from '@shared/entities/filters/part-of-collection/part-of-collection-index-value-search.entity';
import { ProviderFilter } from '@shared/entities/filters/provider/provider-filter.entity';
import { ProviderIndexValueSearch } from '@shared/entities/filters/provider/provider-index-value-search.entity';
import { ResourceTypeFilter } from '@shared/entities/filters/resource-type/resource-type.entity';
import { ResourceTypeIndexValueSearch } from '@shared/entities/filters/resource-type/resource-type-index-value-search.entity';
import { SubjectFilter } from '@shared/entities/filters/subject/subject-filter.entity';
import { MapCreators } from '@shared/helpers/mappers/filters/creators/creators.mappers';
import { MapDateCreated } from '@shared/helpers/mappers/filters/dateCreated/date-created.mapper';
import { MapFunders } from '@shared/helpers/mappers/filters/funder/funder.mapper';
import { MapInstitutions } from '@shared/helpers/mappers/filters/institution/institution.mapper';
import { MapLicenses } from '@shared/helpers/mappers/filters/license/license.mapper';
import { MapPartOfCollections } from '@shared/helpers/mappers/filters/part-of-collection/part-of-collection.mapper';
import { MapProviders } from '@shared/helpers/mappers/filters/provider/provider.mapper';
import { MapResourceType } from '@shared/helpers/mappers/filters/resource-type/resource-type.mapper';
import { MapSubject } from '@shared/helpers/mappers/filters/subject/subject.mapper';

import { environment } from '../../../environments/environment';

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
