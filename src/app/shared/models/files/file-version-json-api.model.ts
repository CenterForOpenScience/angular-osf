import { ListResponse } from '../common/json-api/responses.model';

export type FileVersionsResponseJsonApi = ListResponse<FileVersionDataJsonApi>;

export interface FileVersionDataJsonApi {
  id: string;
  type: string;
  attributes: FileVersionAttributesJsonApi;
  links: FileVersionLinksJsonApi;
}

interface FileVersionAttributesJsonApi {
  content_type: string;
  date_created: Date;
  name: string;
  size: number;
}

interface FileVersionLinksJsonApi {
  download: string;
}
