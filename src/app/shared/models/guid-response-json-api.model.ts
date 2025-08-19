import { JsonApiResponse } from '@osf/core/models';

export type GuidedResponseJsonApi = JsonApiResponse<GuidDataJsonApi, null>;

interface GuidDataJsonApi {
  type: string;
}
