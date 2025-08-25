import { ResourceType } from '@osf/shared/enums';
import { LicenseOptions } from '@osf/shared/models';

import {
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CustomItemMetadataRecord,
  MetadataAttributesJsonApi,
} from '../models';

export class GetResourceMetadata {
  static readonly type = '[Metadata] Get Resource Metadata';
  constructor(
    public resourceId: string,
    public resourceType: ResourceType
  ) {}
}

export class GetCustomItemMetadata {
  static readonly type = '[Metadata] Get Custom Item Metadata';

  constructor(public guid: string) {}
}

export class UpdateCustomItemMetadata {
  static readonly type = '[Metadata] Update Custom Item Metadata';

  constructor(
    public guid: string,
    public metadata: CustomItemMetadataRecord
  ) {}
}

export class UpdateResourceDetails {
  static readonly type = '[Metadata] Update Resource Details';
  constructor(
    public resourceId: string,
    public resourceType: ResourceType,
    public updates: Partial<MetadataAttributesJsonApi>
  ) {}
}

export class UpdateResourceLicense {
  static readonly type = '[Metadata] Update Resource License';
  constructor(
    public resourceId: string,
    public resourceType: ResourceType,
    public licenseId: string,
    public licenseOptions?: LicenseOptions
  ) {}
}

export class GetFundersList {
  static readonly type = '[Metadata] Get Funders List';
  constructor(public search?: string) {}
}

export class GetCedarMetadataTemplates {
  static readonly type = '[Metadata] Get Cedar Metadata Templates';
  constructor(public url?: string) {}
}

export class GetCedarMetadataRecords {
  static readonly type = '[Metadata] Get Cedar Metadata Records';
  constructor(public projectId: string) {}
}

export class CreateCedarMetadataRecord {
  static readonly type = '[Metadata] Create Cedar Metadata Record';
  constructor(public record: CedarMetadataRecord) {}
}

export class UpdateCedarMetadataRecord {
  static readonly type = '[Metadata] Update Cedar Metadata Record';
  constructor(
    public record: CedarMetadataRecord,
    public recordId: string
  ) {}
}

export class AddCedarMetadataRecordToState {
  static readonly type = '[Metadata] Add Cedar Metadata Record To State';
  constructor(public record: CedarMetadataRecordData) {}
}

export class GetUserInstitutions {
  static readonly type = '[Metadata] Get User Institutions';
  constructor(
    public userId: string,
    public page?: number,
    public pageSize?: number
  ) {}
}
