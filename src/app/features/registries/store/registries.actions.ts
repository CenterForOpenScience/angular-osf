import { LicenseOptions } from '@osf/shared/models';

import { RegistrationAttributesJsonApi, RegistrationRelationshipsJsonApi } from '../models';

export class GetRegistries {
  static readonly type = '[Registries] Get Registries';
}

export class GetProviderSchemas {
  static readonly type = '[Registries]  Get Provider Schemas';
  constructor(public providerId: string) {}
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
    public attributes: Partial<RegistrationAttributesJsonApi>,
    public relationships?: Partial<RegistrationRelationshipsJsonApi>
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
    public providerId: string,
    public projectId?: string
  ) {}
}

export class FetchSchemaBlocks {
  static readonly type = '[Registries] Fetch Schema Blocks';
  constructor(public registrationSchemaId: string) {}
}

export class FetchLicenses {
  static readonly type = '[Registries] Fetch Licenses';
  constructor(public providerId: string) {}
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
