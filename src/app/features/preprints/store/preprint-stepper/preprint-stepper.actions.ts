import { StringOrNull } from '@core/helpers';
import { PreprintFileSource } from '@osf/features/preprints/enums';
import { Preprint } from '@osf/features/preprints/models';
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

export class FetchPreprintById {
  static readonly type = '[Submit Preprint] Get Preprint By Id';

  constructor(public id: string) {}
}

export class SetSelectedPreprintFileSource {
  static readonly type = '[Submit Preprint] Set Selected Preprint File Source';

  constructor(public fileSource: PreprintFileSource) {}
}

export class FetchPreprintFilesLinks {
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

export class FetchPreprintFiles {
  static readonly type = '[Submit Preprint] Get Preprint Files';
}

export class FetchAvailableProjects {
  static readonly type = '[Submit Preprint] Get Available Projects';

  constructor(public searchTerm: StringOrNull) {}
}

export class FetchProjectFiles {
  static readonly type = '[Submit Preprint] Get Project Files';

  constructor(public projectId: string) {}
}

export class FetchProjectFilesByLink {
  static readonly type = '[Submit Preprint] Get Project Files By Link';

  constructor(public filesLink: string) {}
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

export class DisconnectProject {
  static readonly type = '[Submit Preprint] Disconnect Preprint Project';
}

export class ConnectProject {
  static readonly type = '[Submit Preprint] Connect Preprint Project';

  constructor(public projectId: string) {}
}

export class FetchPreprintProject {
  static readonly type = '[Submit Preprint] Fetch Preprint Project';
}

export class CreateNewProject {
  static readonly type = '[Submit Preprint] Create Project';

  constructor(
    public title: string,
    public description: string,
    public templateFrom: string,
    public regionId: string,
    public affiliationsId: string[]
  ) {}
}

export class SubmitPreprint {
  static readonly type = '[Submit Preprint] Submit Preprint';
}

export class ResetState {
  static readonly type = '[Submit Preprint] Reset State';
}

export class DeletePreprint {
  static readonly type = '[Submit Preprint]  Delete Preprint';
}

export class SetCurrentFolder {
  static readonly type = '[Submit Preprint] Set Current Folder';

  constructor(public folder: OsfFile | null) {}
}
