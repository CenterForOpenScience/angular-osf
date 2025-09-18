import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { RegistrationMapper } from '@osf/shared/mappers/registration';
import { PaginatedData, RegistrationCard, RegistrationDataJsonApi, ResponseJsonApi } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

@Injectable({
  providedIn: 'root',
})
export class RegistrationsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly apiUrl = `${this.environment.apiDomainUrl}/v2`;

  getRegistrations(projectId: string, page: number, pageSize: number): Observable<PaginatedData<RegistrationCard[]>> {
    const params = {
      page,
      'page[size]': pageSize,
      embed: ['bibliographic_contributors', 'registration_schema', 'provider'],
    };

    const url = `${this.apiUrl}/nodes/${projectId}/registrations/`;

    return this.jsonApiService.get<ResponseJsonApi<RegistrationDataJsonApi[]>>(url, params).pipe(
      map((response) => {
        const data = response.data.map((registration: RegistrationDataJsonApi) =>
          RegistrationMapper.fromRegistrationToRegistrationCard(registration)
        );
        return {
          data,
          totalCount: response.meta?.total,
        };
      })
    );
  }
}
