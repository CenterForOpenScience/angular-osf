import { CedarMetadataRecord, CedarMetadataRecordData } from '@osf/features/project/metadata/models';

import { CustomItemMetadataRecord, RegistryMetadata } from '../../models/registry-metadata.models';

export class GetRegistryForMetadata {
  static readonly type = '[RegistryMetadata] Get Registry For Metadata';
  constructor(public registryId: string) {}
}

export class GetBibliographicContributors {
  static readonly type = '[RegistryMetadata] Get Bibliographic Contributors';
  constructor(
    public registryId: string,
    public page?: number,
    public pageSize?: number
  ) {}
}

export class GetCustomItemMetadata {
  static readonly type = '[RegistryMetadata] Get Custom Item Metadata';
  constructor(public guid: string) {}
}

export class UpdateCustomItemMetadata {
  static readonly type = '[RegistryMetadata] Update Custom Item Metadata';
  constructor(
    public guid: string,
    public metadata: CustomItemMetadataRecord
  ) {}
}

export class UpdateRegistryDetails {
  static readonly type = '[RegistryMetadata] Update Registry Details';
  constructor(
    public registryId: string,
    public updates: Partial<RegistryMetadata>
  ) {}
}

export class GetUserInstitutions {
  static readonly type = '[RegistryMetadata] Get User Institutions';
  constructor(
    public userId: string,
    public page?: number,
    public pageSize?: number
  ) {}
}

export class GetRegistrySubjects {
  static readonly type = '[RegistryMetadata] Get Registry Subjects';
  constructor(
    public registryId: string,
    public page?: number,
    public pageSize?: number
  ) {}
}

export class UpdateRegistrySubjects {
  static readonly type = '[RegistryMetadata] Update Registry Subjects';
  constructor(
    public registryId: string,
    public subjects: { type: string; id: string }[]
  ) {}
}

export class UpdateRegistryInstitutions {
  static readonly type = '[RegistryMetadata] Update Registry Institutions';
  constructor(
    public registryId: string,
    public institutions: { type: string; id: string }[]
  ) {}
}

export class GetRegistryInstitutions {
  static readonly type = '[RegistryMetadata] Get Registry Institutions';
  constructor(
    public registryId: string,
    public page?: number,
    public pageSize?: number
  ) {}
}

export class UpdateRegistryContributor {
  static readonly type = '[RegistryMetadata] Update Registry Contributor';
  constructor(
    public registryId: string,
    public contributorId: string,
    public updateData: {
      id: string;
      type: 'contributors';
      attributes: Record<string, unknown>;
      relationships: Record<string, unknown>;
    }
  ) {}
}

export class AddRegistryContributor {
  static readonly type = '[RegistryMetadata] Add Registry Contributor';
  constructor(
    public registryId: string,
    public contributorData: {
      type: 'contributors';
      attributes: Record<string, unknown>;
      relationships: Record<string, unknown>;
    }
  ) {}
}

export class GetCedarMetadataTemplates {
  static readonly type = '[RegistryMetadata] Get Cedar Metadata Templates';
  constructor(public url?: string) {}
}

export class GetRegistryCedarMetadataRecords {
  static readonly type = '[RegistryMetadata] Get Registry Cedar Metadata Records';
  constructor(public registryId: string) {}
}

export class CreateCedarMetadataRecord {
  static readonly type = '[RegistryMetadata] Create Cedar Metadata Record';
  constructor(public record: CedarMetadataRecord) {}
}

export class UpdateCedarMetadataRecord {
  static readonly type = '[RegistryMetadata] Update Cedar Metadata Record';
  constructor(
    public record: CedarMetadataRecord,
    public recordId: string
  ) {}
}

export class AddCedarMetadataRecordToState {
  static readonly type = '[RegistryMetadata] Add Cedar Metadata Record To State';
  constructor(public record: CedarMetadataRecordData) {}
}

export class GetLicenseFromUrl {
  static readonly type = '[RegistryMetadata] Get License From URL';
  constructor(public licenseUrl: string) {}
}
