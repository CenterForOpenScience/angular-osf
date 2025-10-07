import { FileKind } from '@osf/shared/enums';
import {
  FileDataJsonApi,
  FileDetailsDataJsonApi,
  FileDetailsModel,
  FileExtraJsonApi,
  FileExtraModel,
  FileFolderDataJsonApi,
  FileFolderLinks,
  FileFolderModel,
  FileLinksJsonApi,
  FileLinksModel,
  FileModel,
  FileVersionModel,
  FileVersionsResponseJsonApi,
} from '@osf/shared/models';

import { BaseNodeMapper } from '../nodes';

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
        download: data.links.upload,
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
      filesLink: data.relationships.files?.links.related.href || null,
      target: data.embeds?.target ? BaseNodeMapper.getNodeData(data.embeds?.target.data) : undefined,
      previousFolder: false,
      provider: data.attributes.provider,
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

  static getFileVersions(fileVersions: FileVersionsResponseJsonApi): FileVersionModel[] {
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

  static mapFileToFolder(file: FileModel): FileFolderModel {
    return {
      id: file.id,
      kind: FileKind.Folder,
      name: file.name,
      node: file.target?.id ?? '',
      path: file.path,
      provider: file.provider,
      links: {
        newFolder: file.links.upload + '?kind=folder',
        storageAddons: '',
        upload: file.links.upload,
        filesLink: file.filesLink ?? '',
        download: file.links.upload,
      } as FileFolderLinks,
    };
  }
}
