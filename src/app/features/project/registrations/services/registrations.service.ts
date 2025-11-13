import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { RegistrationMapper } from '@osf/shared/mappers/registration';
import { ResponseJsonApi } from '@osf/shared/models/common/json-api.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';
import { RegistrationCard } from '@osf/shared/models/registration/registration-card.model';
import { RegistrationDataJsonApi } from '@osf/shared/models/registration/registration-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

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
          pageSize: response.meta.per_page,
        };
      })
    );
  }
}
