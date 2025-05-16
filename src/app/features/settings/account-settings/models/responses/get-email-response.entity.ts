import { ApiData, JsonApiResponse } from '@core/services/json-api/json-api.entity';
import { AccountEmailResponse } from '@osf/features/settings/account-settings/models/responses/list-emails.entity';

export type GetEmailResponse = JsonApiResponse<ApiData<AccountEmailResponse, null, null>, null>;
