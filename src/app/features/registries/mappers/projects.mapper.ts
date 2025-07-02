import { Project, ProjectsResponseJsonApi } from '../models';

export class ProjectsMapper {
  static fromProjectsResponse(response: ProjectsResponseJsonApi): Project[] {
    return response.data.map((item) => ({
      id: item.id,
      title: item.attributes.title,
    }));
  }
}
