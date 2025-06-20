import { StringOrNull } from '@core/helpers';
import { PreprintFileSource } from '@osf/features/preprints/enums';
import { Preprint } from '@osf/features/preprints/models';

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

export class ResetStateAndDeletePreprint {
  static readonly type = '[Submit Preprint] Reset State And Delete Preprint';
}
