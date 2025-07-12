import {
  DraftRegistrationAttributesJsonApi,
  DraftRegistrationRelationshipsJsonApi,
  LicenseOptions,
} from '@osf/shared/models';

export class GetRegistries {
  static readonly type = '[Registries] Get Registries';
}

export class GetProviders {
  static readonly type = '[Registries]  Get Providers';
}

export class GetProjects {
  static readonly type = '[Registries] Get Projects';
}

export class CreateDraft {
  static readonly type = '[Registries]  Create Draft';
  constructor(public payload: { registrationSchemaId: string; projectId?: string }) {}
}

export class FetchDraft {
  static readonly type = '[Registries]  Fetch Draft';
  constructor(public draftId: string) {}
}

export class UpdateDraft {
  static readonly type = '[Registries] Update Registration Tags';
  constructor(
    public draftId: string,
    public attributes: Partial<DraftRegistrationAttributesJsonApi>,
    public relationships?: Partial<DraftRegistrationRelationshipsJsonApi>
  ) {}
}

export class DeleteDraft {
  static readonly type = '[Registries]  Delete Draft';
  constructor(public draftId: string) {}
}

export class RegisterDraft {
  static readonly type = '[Registries]  Register Draft Registration';
  constructor(
    public draftId: string,
    public embargoDate: string,
    public projectId?: string
  ) {}
}

export class FetchSchemaBlocks {
  static readonly type = '[Registries] Fetch Schema Blocks';
  constructor(public registrationSchemaId: string) {}
}

export class FetchLicenses {
  static readonly type = '[Registries] Fetch Licenses';
}

export class SaveLicense {
  static readonly type = '[Registries] Save License';
  constructor(
    public registrationId: string,
    public licenseId: string,
    public licenseOptions?: LicenseOptions
  ) {}
}

export class UpdateStepValidation {
  static readonly type = '[Registries] Update Step Validation';
  constructor(
    public step: string,
    public invalid: boolean
  ) {}
}

export class FetchDraftRegistrations {
  static readonly type = '[Registries] Fetch Draft Registrations';
}

export class FetchSubmittedRegistrations {
  static readonly type = '[Registries] Fetch Submitted Registrations';
}
