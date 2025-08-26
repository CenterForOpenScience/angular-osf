import {
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CustomItemMetadataRecord,
  ProjectMetadata,
} from '@osf/features/project/metadata/models';

export class GetProjectForMetadata {
  static readonly type = '[ProjectMetadata] Get Project For Metadata';
  constructor(public projectId: string) {}
}

export class GetCustomItemMetadata {
  static readonly type = '[ProjectMetadata] Get Custom Item Metadata';

  constructor(public guid: string) {}
}

export class UpdateCustomItemMetadata {
  static readonly type = '[ProjectMetadata] Update Custom Item Metadata';

  constructor(
    public guid: string,
    public metadata: CustomItemMetadataRecord
  ) {}
}

export class UpdateProjectDetails {
  static readonly type = '[ProjectMetadata] Update Project Details';
  constructor(
    public projectId: string,
    public updates: Partial<ProjectMetadata>
  ) {}
}

export class GetFundersList {
  static readonly type = '[ProjectMetadata] Get Funders List';
  constructor(public search?: string) {}
}

export class GetCedarMetadataTemplates {
  static readonly type = '[ProjectMetadata] Get Cedar Metadata Templates';
  constructor(public url?: string) {}
}

export class GetCedarMetadataRecords {
  static readonly type = '[ProjectMetadata] Get Cedar Metadata Records';
  constructor(public projectId: string) {}
}

export class CreateCedarMetadataRecord {
  static readonly type = '[ProjectMetadata] Create Cedar Metadata Record';
  constructor(public record: CedarMetadataRecord) {}
}

export class UpdateCedarMetadataRecord {
  static readonly type = '[ProjectMetadata] Update Cedar Metadata Record';
  constructor(
    public record: CedarMetadataRecord,
    public recordId: string
  ) {}
}

export class AddCedarMetadataRecordToState {
  static readonly type = '[ProjectMetadata] Add Cedar Metadata Record To State';
  constructor(public record: CedarMetadataRecordData) {}
}

export class GetUserInstitutions {
  static readonly type = '[ProjectMetadata] Get User Institutions';
  constructor(
    public userId: string,
    public page?: number,
    public pageSize?: number
  ) {}
}
