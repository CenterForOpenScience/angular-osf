import { BooleanOrNull, StringOrNull } from '@core/helpers';
import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { IdName, License, LicenseOptions } from '@shared/models';

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
  nodeId: StringOrNull;
  primaryFileId: StringOrNull;
  licenseId: StringOrNull;
  licenseOptions: LicenseOptions | null;
  hasCoi: BooleanOrNull;
  coiStatement: StringOrNull;
  hasDataLinks: ApplicabilityStatus | null;
  dataLinks: string[];
  whyNoData: StringOrNull;
  hasPreregLinks: ApplicabilityStatus | null;
  whyNoPrereg: StringOrNull;
  preregLinks: string[];
  preregLinkInfo: PreregLinkInfo | null;
  metrics?: PreprintMetrics;
  embeddedLicense?: License;
}

export interface PreprintFilesLinks {
  filesLink: string;
  uploadFileLink: string;
}

export interface PreprintShortInfo {
  id: string;
  title: string;
  dateModified: string;
  contributors: IdName[];
  providerId: string;
}

export interface PreprintShortInfoWithTotalCount {
  data: PreprintShortInfo[];
  totalCount: number;
}

export interface PreprintMetrics {
  downloads: number;
  views: number;
}
