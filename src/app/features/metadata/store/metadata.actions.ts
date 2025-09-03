import { ResourceType } from '@osf/shared/enums';
import { LicenseOptions } from '@osf/shared/models';

import {
  CedarMetadataRecordData,
  CedarRecordDataBinding,
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

export class CreateDoi {
  static readonly type = '[Metadata] Create DOI';
  constructor(
    public resourceId: string,
    public resourceType: ResourceType
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
  constructor(
    public resourceId: string,
    public resourceType: ResourceType
  ) {}
}

export class CreateCedarMetadataRecord {
  static readonly type = '[Metadata] Create Cedar Metadata Record';
  constructor(
    public record: CedarRecordDataBinding,
    public resourceId: string,
    public resourceType: ResourceType
  ) {}
}

export class UpdateCedarMetadataRecord {
  static readonly type = '[Metadata] Update Cedar Metadata Record';
  constructor(
    public record: CedarRecordDataBinding,
    public recordId: string,
    public resourceId: string,
    public resourceType: ResourceType
  ) {}
}

export class AddCedarMetadataRecordToState {
  static readonly type = '[Metadata] Add Cedar Metadata Record To State';
  constructor(public record: CedarMetadataRecordData) {}
}
