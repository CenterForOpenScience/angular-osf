import { StringOrNull } from '@core/helpers';
import { PreprintFileSource } from '@osf/features/preprints/enums';
import { Preprint } from '@osf/features/preprints/models';
import { ContributorAddModel, ContributorModel } from '@shared/components/contributors/models';
import { LicenseOptions, OsfFile } from '@shared/models';

export class SetSelectedPreprintProviderId {
  static readonly type = '[Submit Preprint] Set Selected Preprint Provider Id';

  constructor(public id: StringOrNull) {}
}

export class CreatePreprint {
  static readonly type = '[Submit Preprint] Create Preprint';

  constructor(
    public title: string,
    public abstract: string,
    public providerId: string
  ) {}
}

export class UpdatePreprint {
  static readonly type = '[Submit Preprint] Update Preprint';

  constructor(
    public id: string,
    public payload: Partial<Preprint>
  ) {}
}

export class SetSelectedPreprintFileSource {
  static readonly type = '[Submit Preprint] Set Selected Preprint File Source';

  constructor(public fileSource: PreprintFileSource) {}
}

export class GetPreprintFilesLinks {
  static readonly type = '[Submit Preprint] Get Preprint Files Links';
}

export class UploadFile {
  static readonly type = '[Submit Preprint] Upload File';

  constructor(public file: File) {}
}

export class ReuploadFile {
  static readonly type = '[Submit Preprint] Reupload File';

  constructor(public file: File) {}
}

export class CopyFileFromProject {
  static readonly type = '[Submit Preprint] Copy File From Project';

  constructor(public file: OsfFile) {}
}

export class GetPreprintFiles {
  static readonly type = '[Submit Preprint] Get Preprint Files';
}

export class GetAvailableProjects {
  static readonly type = '[Submit Preprint] Get Available Projects';

  constructor(public searchTerm: StringOrNull) {}
}

export class GetProjectFiles {
  static readonly type = '[Submit Preprint] Get Project Files';

  constructor(public projectId: string) {}
}

export class GetProjectFilesByLink {
  static readonly type = '[Submit Preprint] Get Project Files By Link';

  constructor(public filesLink: string) {}
}

export class FetchContributors {
  static readonly type = '[Submit Preprint] Fetch Contributors';
}

export class AddContributor {
  static readonly type = '[Submit Preprint] Add Contributor';

  constructor(public contributor: ContributorAddModel) {}
}

export class UpdateContributor {
  static readonly type = '[Submit Preprint] Update Contributor';

  constructor(public contributor: ContributorModel) {}
}

export class DeleteContributor {
  static readonly type = '[Submit Preprint] Delete Contributor';

  constructor(public userId: string) {}
}

export class FetchLicenses {
  static readonly type = '[Submit Preprint] Fetch Licenses';
}

export class SaveLicense {
  static readonly type = '[Submit Preprint] Save License';

  constructor(
    public licenseId: string,
    public licenseOptions?: LicenseOptions
  ) {}
}

export class ResetStateAndDeletePreprint {
  static readonly type = '[Submit Preprint] Reset State And Delete Preprint';
}
