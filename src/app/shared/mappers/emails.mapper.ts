import { AccountEmailModel } from '../models/emails/account-email.model';
import { EmailsDataJsonApi } from '../models/emails/account-emails-json-api.model';

export function MapEmails(emails: EmailsDataJsonApi[]): AccountEmailModel[] {
  return emails.map((item) => MapEmail(item));
}

export function MapEmail(email: EmailsDataJsonApi): AccountEmailModel {
  return {
    id: email.id,
    emailAddress: email.attributes.email_address,
    confirmed: email.attributes.confirmed,
    verified: email.attributes.verified,
    primary: email.attributes.primary,
    isMerge: email.attributes.is_merge,
  };
}
