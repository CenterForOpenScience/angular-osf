import { StringOrNull } from '@core/helpers';
import { LicenseOptions } from '@shared/models';

export interface Preprint {
  id: string;
  dateCreated: string;
  dateModified: string;
  title: string;
  description: string;
  doi: StringOrNull;
  originalPublicationDate: Date | null;
  customPublicationCitation: StringOrNull;
  isPublished: boolean;
  tags: string[];
  isPublic: boolean;
  version: number;
  isLatestVersion: boolean;
  primaryFileId: StringOrNull;
  licenseId: StringOrNull;
  licenseOptions: LicenseOptions | null;
}

export interface PreprintFilesLinks {
  filesLink: string;
  uploadFileLink: string;
}
