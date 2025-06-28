import { ApiData, MetaJsonApi, PaginationLinksJsonApi } from '@osf/core/models';

export interface ProjectsResponseJsonApi {
  data: ProjectsDataJsonApi[];
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export type ProjectsDataJsonApi = ApiData<ProjectsAttributesJsonApi, null, null, null>;

interface ProjectsAttributesJsonApi {
  title: string;
}
