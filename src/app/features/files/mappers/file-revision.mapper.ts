import { ApiData } from '@core/models';
import { OsfFileRevision } from '@osf/features/project/files/models/osf-models/file-revisions.model';
import { FileRevisionJsonApi } from '@osf/features/project/files/models/responses/get-file-revisions-response.model';

export function MapFileRevision(data: ApiData<FileRevisionJsonApi, null, null, null>[]): OsfFileRevision[] {
  return data.map((revision) => ({
    downloads: revision.attributes.extra.downloads,
    hashes: { md5: revision.attributes.extra.hashes.md5, sha256: revision.attributes.extra.hashes.sha256 },
    dateTime: new Date(revision.attributes.modified_utc),
    version: revision.attributes.version,
  }));
}
