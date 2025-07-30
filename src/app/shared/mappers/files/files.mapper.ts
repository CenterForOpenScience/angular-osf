import { ApiData } from '@core/models';
import { FileTargetResponse } from '@osf/features/project/files/models/responses/get-file-target-response.model';
import {
  FileLinks,
  FileRelationshipsResponse,
  FileResponse,
  FileVersionsResponseJsonApi,
  OsfFile,
  OsfFileVersion,
} from '@osf/shared/models';

export function MapFiles(
  files: ApiData<FileResponse, FileTargetResponse, FileRelationshipsResponse, FileLinks>[]
): OsfFile[] {
  return files.map((file) => MapFile(file));
}

export function MapFile(
  file: ApiData<FileResponse, FileTargetResponse, FileRelationshipsResponse, FileLinks>
): OsfFile {
  return {
    id: file.id,
    guid: file.attributes?.guid,
    name: file.attributes.name,
    kind: file.attributes.kind,
    size: file.attributes.size,
    provider: file.attributes.provider,
    dateModified: file.attributes.date_modified,
    dateCreated: file.attributes.date_created,
    extra: file.attributes.extra,
    links: {
      info: file.links?.info,
      move: file.links?.move,
      upload: file.links?.upload,
      delete: file.links?.delete,
      download: file.links?.download,
      self: file.links?.self,
      html: file.links?.html,
      render: file.links?.render,
      newFolder: file.links?.new_folder,
    },
    path: file.attributes.path,
    materializedPath: file.attributes.materialized_path,
    tags: file.attributes.tags,
    relationships: {
      parentFolderLink: file?.relationships?.parent_folder?.links?.related?.href,
      parentFolderId: file?.relationships?.parent_folder?.data?.id,
      filesLink: file?.relationships?.files?.links?.related?.href,
    },
    target: {
      title: file?.embeds?.target.data.attributes.title,
      description: file?.embeds?.target.data.attributes.description,
      category: file?.embeds?.target.data.attributes.category,
      customCitation: file?.embeds?.target.data.attributes.custom_citation,
      dateCreated: file?.embeds?.target.data.attributes.date_created,
      dateModified: file?.embeds?.target.data.attributes.date_modified,
      registration: file?.embeds?.target.data.attributes.registration,
      preprint: file?.embeds?.target.data.attributes.preprint,
      fork: file?.embeds?.target.data.attributes.fork,
      collection: file?.embeds?.target.data.attributes.collection,
      tags: file?.embeds?.target.data.attributes.tags,
      nodeLicense: file?.embeds?.target.data.attributes.node_license,
      analyticsKey: file?.embeds?.target.data.attributes.analytics_key,
    },
  } as OsfFile;
}

export function MapFileVersions(fileVersions: FileVersionsResponseJsonApi): OsfFileVersion[] {
  return fileVersions.data.map((fileVersion) => {
    return {
      id: fileVersion.id,
      size: fileVersion.attributes.size,
      dateCreated: fileVersion.attributes.date_created,
      name: fileVersion.attributes.name,
      downloadLink: fileVersion.links.download,
    };
  });
}
