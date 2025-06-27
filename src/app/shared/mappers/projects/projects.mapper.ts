import { Project, ProjectsGetResponseJsonApi } from '@shared/models/projects';

export class ProjectsMapper {
  static fromGetProjectsResponse(response: ProjectsGetResponseJsonApi): Project[] {
    return response.data.map((project) => ({
      id: project.id,
      title: project.attributes.title,
      dateModified: project.attributes.date_modified,
      isPublic: project.attributes.public,
      nodeLicense: project.attributes.node_license,
      description: project.attributes.description,
      tags: project.attributes.tags || [],
    }));
  }
}
