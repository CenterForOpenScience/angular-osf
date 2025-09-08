import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { RegistrationMapper } from '@osf/shared/mappers/registration';
import { PaginatedData, RegistrationCard, RegistrationDataJsonApi, ResponseJsonApi } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistrationsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = `${environment.apiDomainUrl}/v2`;

  getRegistrations(projectId: string): Observable<PaginatedData<RegistrationCard[]>> {
    const params: Record<string, unknown> = { embed: 'contributors' };

    const url = `${this.apiUrl}/nodes/${projectId}/linked_by_registrations/`;

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
