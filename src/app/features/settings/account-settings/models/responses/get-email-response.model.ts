import { ApiData, JsonApiResponse } from '@osf/core/models';

import { AccountEmailResponseJsonApi } from './list-emails.model';

export type GetEmailResponseJsonApi = JsonApiResponse<ApiData<AccountEmailResponseJsonApi, null, null, null>, null>;
