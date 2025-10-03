import { FileTargetResponse } from '@osf/features/files/models';
import {
  ApiData,
  FileDataJsonApi,
  FileDetailsDataJsonApi,
  FileDetailsModel,
  FileExtraJsonApi,
  FileExtraModel,
  FileFolderDataJsonApi,
  FileFolderModel,
  FileLinks,
  FileLinksJsonApi,
  FileLinksModel,
  FileModel,
  FileRelationshipsResponse,
  FileResponse,
  FileVersionsResponseJsonApi,
  OsfFile,
  OsfFileVersion,
} from '@osf/shared/models';

import { BaseNodeMapper } from '../nodes';

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
      download: file.attributes.kind === 'folder' ? file.links.upload : file.links?.download,
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
      uploadLink: file?.links?.upload,
      newFolderLink: file?.links?.new_folder,
    },
    target: {
      id: file?.embeds?.target.data.id,
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
      type: file?.embeds?.target.data.type,
      currentUserCanComment: file?.embeds?.target.data.attributes.current_user_can_comment,
      currentUserIsContributor: file?.embeds?.target.data.attributes.current_user_is_contributor,
      currentUserIsContributorOrGroupMember:
        file?.embeds?.target.data.attributes.current_user_is_contributor_or_group_member,
      currentUserPermissions: file?.embeds?.target.data.attributes.current_user_permissions,
      wikiEnabled: file?.embeds?.target.data.attributes.wiki_enabled,
      public: file?.embeds?.target.data.attributes.public,
      link: file?.embeds?.target.data.links.self,
    },
    currentUserCanComment: file.attributes.current_user_can_comment,
    currentVersion: file.attributes.current_version,
    lastTouched: file.attributes.last_touched,
    previousFolder: false,
    showAsUnviewed: file.attributes.show_as_unviewed,
  };
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

export class FilesMapper {
  static getFileFolder(data: FileFolderDataJsonApi): FileFolderModel {
    return {
      id: data.id,
      name: data.attributes.name,
      path: data.attributes.path,
      kind: data.attributes.kind,
      node: data.attributes.node,
      provider: data.attributes.provider,
      links: {
        upload: data.links.upload,
        newFolder: data.links.new_folder,
        storageAddons: data.links.storage_addons,
        filesLink: data.relationships.files.links.related.href,
      },
    };
  }

  static getFileFolders(data: FileFolderDataJsonApi[]): FileFolderModel[] {
    return data.map((folder) => this.getFileFolder(folder));
  }

  static getFile(data: FileDataJsonApi): FileModel {
    return {
      id: data.id,
      guid: data.attributes.guid,
      name: data.attributes.name,
      kind: data.attributes.kind,
      path: data.attributes.path,
      size: data.attributes.size,
      materializedPath: data.attributes.materialized_path,
      dateModified: data.attributes.date_modified,
      extra: this.getFileExtra(data.attributes.extra),
      links: this.getFileLinks(data.links),
      parentFolderId: data.relationships.parent_folder.data?.id || null,
      parentFolderLink: data.relationships.parent_folder.links.related.href || null,
      filesLink: data.relationships.files?.links.related.href || null,
      target: data.embeds?.target ? BaseNodeMapper.getNodeData(data.embeds?.target.data) : undefined,
      previousFolder: false,
    };
  }

  static getFiles(data: FileDataJsonApi[]): FileModel[] {
    return data.map((file) => this.getFile(file));
  }

  static getFileDetails(data: FileDetailsDataJsonApi): FileDetailsModel {
    return {
      id: data.id,
      guid: data.attributes.guid,
      name: data.attributes.name,
      kind: data.attributes.kind,
      path: data.attributes.path,
      size: data.attributes.size,
      materializedPath: data.attributes.materialized_path,
      dateModified: data.attributes.date_modified,
      provider: data.attributes.provider,
      lastTouched: data.attributes.last_touched,
      dateCreated: data.attributes.date_created,
      tags: data.attributes.tags,
      currentVersion: data.attributes.current_version,
      showAsUnviewed: data.attributes.show_as_unviewed,
      extra: this.getFileExtra(data.attributes.extra),
      links: this.getFileLinks(data.links),
      target: BaseNodeMapper.getNodeData(data.embeds!.target.data),
    };
  }

  static getFileLinks(links: FileLinksJsonApi): FileLinksModel {
    return {
      info: links.info,
      move: links.move,
      upload: links.upload,
      delete: links.delete,
      download: links.download,
      render: links.render,
      html: links.html,
      self: links.self,
    };
  }

  static getFileExtra(extra: FileExtraJsonApi): FileExtraModel {
    return {
      downloads: extra.downloads,
      hashes: {
        md5: extra.hashes.md5,
        sha256: extra.hashes.sha256,
      },
    };
  }
}
