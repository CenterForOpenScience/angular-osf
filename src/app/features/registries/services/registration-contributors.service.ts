import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';
import { AddContributorType } from '@osf/shared/components/contributors/enums';
import { ContributorsMapper } from '@osf/shared/components/contributors/mappers';
import { ContributorAddModel, ContributorModel, ContributorResponse } from '@osf/shared/components/contributors/models';

import { environment } from 'src/environments/environment';

@Injectable()
export class RegistrationContributorsService {
  private apiUrl = environment.apiUrl;
  private readonly jsonApiService = inject(JsonApiService);

  getContributors(draftId: string): Observable<ContributorModel[]> {
    return this.jsonApiService
      .get<JsonApiResponse<ContributorResponse[], null>>(`${this.apiUrl}/draft_registrations/${draftId}/contributors/`)
      .pipe(map((contributors) => ContributorsMapper.fromResponse(contributors.data)));
  }

  addContributor(draftId: string, data: ContributorAddModel): Observable<ContributorModel> {
    const baseUrl = `${this.apiUrl}/draft_registrations/${draftId}/contributors/`;
    const type = data.id ? AddContributorType.Registered : AddContributorType.Unregistered;

    const contributorData = { data: ContributorsMapper.toContributorAddRequest(data, type) };

    return this.jsonApiService
      .post<ContributorResponse>(baseUrl, contributorData)
      .pipe(map((contributor) => ContributorsMapper.fromContributorResponse(contributor)));
  }

  updateContributor(draftId: string, data: ContributorModel): Observable<ContributorModel> {
    const baseUrl = `${environment.apiUrl}/draft_registrations/${draftId}/contributors/${data.userId}`;

    const contributorData = { data: ContributorsMapper.toContributorAddRequest(data) };

    return this.jsonApiService
      .patch<ContributorResponse>(baseUrl, contributorData)
      .pipe(map((contributor) => ContributorsMapper.fromContributorResponse(contributor)));
  }

  deleteContributor(draftId: string, contributorId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/draft_registrations/${draftId}/contributors/${contributorId}`);
  }
}
