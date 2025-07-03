import { StringOrNull } from '@core/helpers';
import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
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
  hasCoi: boolean;
  coiStatement: StringOrNull;
  hasDataLinks: ApplicabilityStatus;
  dataLinks: string[];
  whyNoData: StringOrNull;
  hasPreregLinks: ApplicabilityStatus;
  whyNoPrereg: StringOrNull;
  preregLinks: string[];
  preregLinkInfo: PreregLinkInfo | null;
}

export interface PreprintFilesLinks {
  filesLink: string;
  uploadFileLink: string;
}
