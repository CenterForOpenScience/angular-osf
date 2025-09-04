import { ResponseDataJsonApi, ResponseJsonApi } from '@osf/shared/models';

export type EmailsResponseJsonApi = ResponseJsonApi<EmailsDataJsonApi[]>;

export type EmailResponseJsonApi = ResponseDataJsonApi<EmailsDataJsonApi>;

export interface EmailsDataJsonApi {
  id: string;
  attributes: EmailsAttributesJsonApi;
}

interface EmailsAttributesJsonApi {
  email_address: string;
  confirmed: boolean;
  verified: boolean;
  primary: boolean;
  is_merge: boolean;
}
