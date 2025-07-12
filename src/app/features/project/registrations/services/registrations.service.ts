import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponseWithPaging } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';
import { RegistrationMapper } from '@osf/shared/mappers/registration';
import { RegistrationCard, RegistrationDataJsonApi } from '@osf/shared/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistrationsService {
  private readonly jsonApiService = inject(JsonApiService);

  getRegistrations(projectId: string): Observable<{ data: RegistrationCard[]; totalCount: number }> {
    const params: Record<string, unknown> = {
      embed: 'contributors',
    };
    const url = `${environment.apiUrl}/nodes/${projectId}/linked_by_registrations/`;

    return this.jsonApiService.get<JsonApiResponseWithPaging<RegistrationDataJsonApi[], null>>(url, params).pipe(
      map((response) => {
        const data = response.data.map((registration: RegistrationDataJsonApi) =>
          RegistrationMapper.fromRegistrationToRegistrationCard(registration)
        );
        return {
          data,
          totalCount: response.links.meta?.total,
        };
      })
    );
  }
}
