import {
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CustomItemMetadataRecord,
} from '@osf/features/project/metadata/models';

export class GetProjectForMetadata {
  static readonly type = '[Project Metadata] Get Project For Metadata';
  constructor(public projectId: string) {}
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

export class UpdateProjectDescription {
  static readonly type = '[Project Metadata] Update Project Description';
  constructor(
    public projectId: string,
    public description: string
  ) {}
}

export class UpdateProjectDetails {
  static readonly type = '[Project Metadata] Update Project Details';
  constructor(
    public projectId: string,
    public updates: Partial<{
      title: string;
      description: string;
      tags: string[];
      category: string;
      institutions: string[];
      doi?: boolean;
      node_license?: {
        id: string;
        type: string;
      };
    }>
  ) {}
}
export class GetFundersList {
  static readonly type = '[Project Metadata] Get Funders List';
  constructor(public search?: string) {}
}

export class GetCedarMetadataTemplates {
  static readonly type = '[Project Metadata] Get Cedar Metadata Templates';
  constructor(public url?: string) {}
}

export class ResetCustomItemMetadata {
  static readonly type = '[Metadata] Reset Custom Item Metadata';
}

export class GetCedarMetadataRecords {
  static readonly type = '[Project Metadata] Get Cedar Metadata Records';
  constructor(public projectId: string) {}
}

export class CreateCedarMetadataRecord {
  static readonly type = '[Project Metadata] Create Cedar Metadata Record';
  constructor(public record: CedarMetadataRecord) {}
}

export class UpdateCedarMetadataRecord {
  static readonly type = '[Project Metadata] Update Cedar Metadata Record';
  constructor(
    public record: CedarMetadataRecord,
    public recordId: string
  ) {}
}

export class AddCedarMetadataRecordToState {
  static readonly type = '[Project Metadata] Add Cedar Metadata Record To State';
  constructor(public record: CedarMetadataRecordData) {}
}

export class GetUserInstitutions {
  static readonly type = '[Project Metadata] Get User Institutions';
  constructor(
    public userId: string,
    public page?: number,
    public pageSize?: number
  ) {}
}
