import { CollectionSubmissionMetadataPayloadJsonApi } from '@osf/features/collections/models';
import { ProjectMetadataUpdatePayload } from '@shared/models';
import { Project, ProjectJsonApi, ProjectsResponseJsonApi } from '@shared/models/projects';

export class ProjectsMapper {
  static fromGetAllProjectsResponse(response: ProjectsResponseJsonApi): Project[] {
    return response.data.map((project) => this.fromProjectResponse(project));
  }

  static fromProjectResponse(project: ProjectJsonApi): Project {
    return {
      id: project.id,
      type: project.type,
      title: project.attributes.title,
      dateModified: project.attributes.date_modified,
      isPublic: project.attributes.public,
      licenseId: project.relationships.license?.data?.id || null,
      licenseOptions: project.attributes.node_license
        ? {
            year: project.attributes.node_license.year,
            copyrightHolders: project.attributes.node_license.copyright_holders.join(','),
          }
        : null,
      description: project.attributes.description,
      tags: project.attributes.tags || [],
    };
  }

  static toUpdateProjectRequest(metadata: ProjectMetadataUpdatePayload): CollectionSubmissionMetadataPayloadJsonApi {
    return {
      data: {
        type: 'nodes',
        id: metadata.id,
        relationships: {
          license: {
            data: {
              id: metadata.licenseId,
              type: 'licenses',
            },
          },
        },
        attributes: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          ...(metadata.licenseOptions && {
            node_license: {
              copyright_holders: [metadata.licenseOptions.copyrightHolders],
              year: metadata.licenseOptions.year,
            },
          }),
        },
      },
    };
  }
}
