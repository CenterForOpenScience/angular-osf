import { ApiData, JsonApiResponse } from '@osf/core/models';

import { AccountEmailResponse } from './list-emails.model';

export type GetEmailResponse = JsonApiResponse<ApiData<AccountEmailResponse, null, null, null>, null>;
