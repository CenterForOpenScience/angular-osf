import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse, ListResponse } from '../common/json-api/responses.model';

export type EmailsResponseJsonApi = ListResponse<EmailsDataJsonApi>;
export type EmailResponseJsonApi = ItemResponse<EmailsDataJsonApi>;

export type EmailsDataJsonApi = JsonApiResource<'user_emails', EmailsAttributesJsonApi>;

interface EmailsAttributesJsonApi {
  confirmed: boolean;
  email_address: string;
  is_merge: boolean;
  primary: boolean;
  verified: boolean;
}
