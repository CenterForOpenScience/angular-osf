import { JsonApiResponse } from './common';

export type GuidedResponseJsonApi = JsonApiResponse<GuidDataJsonApi, null>;

interface GuidDataJsonApi {
  id: string;
  type: string;
}
