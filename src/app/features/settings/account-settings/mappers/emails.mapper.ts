import { ApiData } from '@osf/core/models';

import { AccountEmail, AccountEmailResponseJsonApi } from '../models';

export function MapEmails(emails: ApiData<AccountEmailResponseJsonApi, null, null, null>[]): AccountEmail[] {
  const accountEmails: AccountEmail[] = [];
  emails.forEach((email) => {
    accountEmails.push(MapEmail(email));
  });
  return accountEmails;
}

export function MapEmail(email: ApiData<AccountEmailResponseJsonApi, null, null, null>): AccountEmail {
  return {
    id: email.id,
    emailAddress: email.attributes.email_address,
    confirmed: email.attributes.confirmed,
    verified: email.attributes.verified,
    primary: email.attributes.primary,
    isMerge: email.attributes.is_merge,
  };
}
