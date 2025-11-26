import { CollectionSubmissionMetadataPayloadJsonApi } from '@osf/features/collections/models';
import { ProjectMetadataUpdatePayload } from '@osf/shared/models/project-metadata-update-payload.model';
import { ProjectModel } from '@osf/shared/models/projects/projects.models';
import { ProjectJsonApi, ProjectsResponseJsonApi } from '@osf/shared/models/projects/projects-json-api.models';
import { replaceBadEncodedChars } from '@shared/helpers/format-bad-encoding.helper';

export class ProjectsMapper {
  static fromGetAllProjectsResponse(response: ProjectsResponseJsonApi): ProjectModel[] {
    return response.data.map((project) => this.fromProjectResponse(project));
  }

  static fromProjectResponse(project: ProjectJsonApi): ProjectModel {
    return {
      id: project.id,
      type: project.type,
      title: replaceBadEncodedChars(project.attributes.title),
      dateModified: project.attributes.date_modified,
      isPublic: project.attributes.public,
      licenseId: project.relationships.license?.data?.id || null,
      licenseOptions: project.attributes.node_license
        ? {
            year: project.attributes.node_license.year,
            copyrightHolders: project.attributes.node_license.copyright_holders.join(','),
          }
        : null,
      description: replaceBadEncodedChars(project.attributes.description),
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
          title: replaceBadEncodedChars(metadata.title),
          description: replaceBadEncodedChars(metadata.description),
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
