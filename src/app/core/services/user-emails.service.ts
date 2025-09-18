import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { MapEmail, MapEmails } from '@osf/shared/mappers';
import { AccountEmailModel, EmailResponseJsonApi, EmailsDataJsonApi, EmailsResponseJsonApi } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

@Injectable({
  providedIn: 'root',
})
export class UserEmailsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly baseUrl = `${this.environment.apiDomainUrl}/v2/users`;

  getEmails(): Observable<AccountEmailModel[]> {
    const params: Record<string, string> = {
      page: '1',
      'page[size]': '10',
    };

    return this.jsonApiService
      .get<EmailsResponseJsonApi>(`${this.baseUrl}/me/settings/emails/`, params)
      .pipe(map((response) => MapEmails(response.data)));
  }

  resendConfirmation(emailId: string): Observable<AccountEmailModel> {
    const params: Record<string, string> = {
      resend_confirmation: 'true',
    };

    return this.jsonApiService
      .get<EmailResponseJsonApi>(`${this.baseUrl}/me/settings/emails/${emailId}/`, params)
      .pipe(map((response) => MapEmail(response.data)));
  }

  addEmail(userId: string, email: string): Observable<AccountEmailModel> {
    const body = {
      data: {
        attributes: {
          email_address: email,
        },
        relationships: {
          user: {
            data: {
              id: userId,
              type: 'users',
            },
          },
        },
        type: 'user_emails',
      },
    };

    return this.jsonApiService
      .post<EmailResponseJsonApi>(`${this.baseUrl}/${userId}/settings/emails/`, body)
      .pipe(map((response) => MapEmail(response.data)));
  }

  verifyEmail(emailId: string): Observable<AccountEmailModel> {
    const body = {
      data: {
        id: emailId,
        attributes: {
          verified: true,
        },
        type: 'user_emails',
      },
    };

    return this.jsonApiService
      .patch<EmailsDataJsonApi>(`${this.baseUrl}/me/settings/emails/${emailId}/`, body)
      .pipe(map((response) => MapEmail(response)));
  }

  makePrimary(emailId: string): Observable<AccountEmailModel> {
    const body = {
      data: {
        id: emailId,
        attributes: {
          primary: true,
        },
        type: 'user_emails',
      },
    };

    return this.jsonApiService
      .patch<EmailsDataJsonApi>(`${this.baseUrl}/me/settings/emails/${emailId}/`, body)
      .pipe(map((response) => MapEmail(response)));
  }

  deleteEmail(emailId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.baseUrl}/me/settings/emails/${emailId}/`);
  }
}
