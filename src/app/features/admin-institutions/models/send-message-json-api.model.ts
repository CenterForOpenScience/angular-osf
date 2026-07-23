import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse } from '@osf/shared/models/common/json-api/responses.model';

export type SendMessageResponseJsonApi = ItemResponse<SendMessageDataJsonApi>;

export type SendMessageDataJsonApi = JsonApiResource<'send-message', SendMessageAttributesJsonApi>;

interface SendMessageAttributesJsonApi {
  message_text: string;
  message_type: string;
  bcc_sender: boolean;
  reply_to: boolean;
}
