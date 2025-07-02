import { ContributorAddModel, ContributorModel } from '@osf/shared/components/contributors/models';
import { Subject } from '@osf/shared/models';

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

export class DeleteDraft {
  static readonly type = '[Registries]  Delete Draft';
  constructor(public draftId: string) {}
}

export class FetchSchemaBlocks {
  static readonly type = '[Registries] Fetch Schema Blocks';
  constructor(public registrationSchemaId: string) {}
}

export class FetchContributors {
  static readonly type = '[Registries] Fetch Contributors';

  constructor(public draftId: string) {}
}

export class AddContributor {
  static readonly type = '[Registries] Add Contributor';

  constructor(
    public draftId: string,
    public contributor: ContributorAddModel
  ) {}
}

export class UpdateContributor {
  static readonly type = '[Registries] Update Contributor';

  constructor(
    public draftId: string,
    public contributor: ContributorModel
  ) {}
}

export class DeleteContributor {
  static readonly type = '[Registries] Delete Contributor';

  constructor(
    public draftId: string,
    public contributorId: string
  ) {}
}

export class FetchLicenses {
  static readonly type = '[Registries] Fetch Licenses';
}

export class FetchRegistrationSubjects {
  static readonly type = '[Registries] Fetch Registration Subjects';
  constructor(public registrationId: string) {}
}

export class UpdateRegistrationSubjects {
  static readonly type = '[Registries] Update Registration Subject';
  constructor(
    public registrationId: string,
    public subjects: Subject[]
  ) {}
}
