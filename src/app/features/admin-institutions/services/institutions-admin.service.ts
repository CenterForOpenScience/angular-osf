import { catchError, map, Observable, of } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { mapIndexCardResults } from '@osf/features/admin-institutions/mappers/institution-summary-index.mapper';
import { departmens, summaryMetrics } from '@osf/features/admin-institutions/services/mock';

import { environment } from '../../../../environments/environment';
import {
  InstitutionDepartment,
  InstitutionDepartmentsJsonApi,
  InstitutionIndexValueSearchJsonApi,
  InstitutionSearchFilter,
  InstitutionSummaryMetrics,
  InstitutionSummaryMetricsJsonApi,
} from '../models';

import { mapInstitutionDepartments, mapInstitutionSummaryMetrics } from 'src/app/features/admin-institutions/mappers';

@Injectable({
  providedIn: 'root',
})
export class InstitutionsAdminService {
  hardcodedUrl = 'https://api.test.osf.io/v2';

  private jsonApiService = inject(JsonApiService);

  fetchDepartments(institutionId: string): Observable<InstitutionDepartment[]> {
    return this.jsonApiService
      .get<InstitutionDepartmentsJsonApi>(`${this.hardcodedUrl}/institutions/${institutionId}/metrics/departments/`)
      .pipe(
        //TODO: remove mock data
        catchError(() => {
          return of(departmens as InstitutionDepartmentsJsonApi);
        }),
        map((res) => mapInstitutionDepartments(res))
      );
  }

  fetchSummary(institutionId: string): Observable<InstitutionSummaryMetrics> {
    return this.jsonApiService
      .get<InstitutionSummaryMetricsJsonApi>(`${this.hardcodedUrl}/institutions/${institutionId}/metrics/summary/`)
      .pipe(
        //TODO: remove mock data
        catchError(() => {
          return of(summaryMetrics as InstitutionSummaryMetricsJsonApi);
        }),
        map((result) => mapInstitutionSummaryMetrics(result.data.attributes))
      );
  }

  fetchIndexValueSearch(
    institutionId: string,
    valueSearchPropertyPath: string,
    additionalParams?: Record<string, string>
  ): Observable<InstitutionSearchFilter[]> {
    const params: Record<string, string> = {
      //TODO: change here https://test.osf.io to current environment
      'cardSearchFilter[affiliation]': `https://ror.org/05d5mza29,https://test.osf.io/institutions/${institutionId}/`,
      valueSearchPropertyPath,
      'page[size]': '10',
      ...additionalParams,
    };

    return this.jsonApiService
      .get<InstitutionIndexValueSearchJsonApi>(`${environment.shareDomainUrl}/index-value-search`, params)
      .pipe(map((response) => mapIndexCardResults(response?.included)));
  }
}
