import { FileModel, FilePayloadJsonApi } from '@osf/shared/models';

export class FilesMapper {
  static toFilePayload(file: FileModel): FilePayloadJsonApi {
    return {
      file_id: file.id,
      file_name: file.name,
      file_urls: {
        html: file.links.html,
        download: file.links.download,
      },
      file_hashes: {
        sha256: file.extra?.hashes?.sha256 || '',
      },
    };
  }
}
