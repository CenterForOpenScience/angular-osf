import { ApiData } from '@core/services/json-api/json-api.entity';
import { AccountEmail } from '@osf/features/settings/account-settings/models/osf-models/account-email.model';
import { AccountEmailResponse } from '@osf/features/settings/account-settings/models/responses/list-emails.entity';

export function MapEmails(emails: ApiData<AccountEmailResponse, null, null>[]): AccountEmail[] {
  const accountEmails: AccountEmail[] = [];
  emails.forEach((email) => {
    accountEmails.push(MapEmail(email));
  });
  return accountEmails;
}

export function MapEmail(email: ApiData<AccountEmailResponse, null, null>): AccountEmail {
  return {
    id: email.id,
    emailAddress: email.attributes.email_address,
    confirmed: email.attributes.confirmed,
    verified: email.attributes.verified,
    primary: email.attributes.primary,
    isMerge: email.attributes.is_merge,
  };
}
