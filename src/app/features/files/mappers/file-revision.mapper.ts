import { OsfFileRevision } from '../models/file-revisions.model';
import { FileRevisionDataJsonApi } from '../models/file-revisions-response.model';

export function MapFileRevision(data: FileRevisionDataJsonApi[]): OsfFileRevision[] {
  return data.map((revision) => ({
    downloads: revision.attributes.extra.downloads ?? 0,
    hashes: { md5: revision.attributes.extra.hashes?.md5, sha256: revision.attributes.extra.hashes?.sha256 },
    dateTime: new Date(revision.attributes.modified_utc),
    version: revision.attributes.version,
  }));
}
