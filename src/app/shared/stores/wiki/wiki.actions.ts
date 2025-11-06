import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { WikiModes } from '@shared/models/wiki/wiki.model';

export class CreateWiki {
  static readonly type = '[Wiki] Create Wiki';

  constructor(
    public resourceType: ResourceType,
    public resourceId: string,
    public name: string
  ) {}
}

export class RenameWiki {
  static readonly type = '[Wiki] Rename Wiki';

  constructor(
    public wikiId: string,
    public name: string
  ) {}
}

export class DeleteWiki {
  static readonly type = '[Wiki] Delete Wiki';
  constructor(public wikiId: string) {}
}

export class GetHomeWiki {
  static readonly type = '[Wiki] Get Home Wiki';

  constructor(
    public resourceType: ResourceType,
    public resourceId: string
  ) {}
}

export class ClearWiki {
  static readonly type = '[Wiki] Clear Wiki';
}

export class GetWikiList {
  static readonly type = '[Wiki] Get Wiki List';

  constructor(
    public resourceType: ResourceType,
    public resourceId: string
  ) {}
}

export class GetComponentsWikiList {
  static readonly type = '[Wiki] Get Components Wiki List';

  constructor(
    public resourceType: ResourceType,
    public resourceId: string
  ) {}
}

export class GetWikiModes {
  static readonly type = '[Wiki] Get Wiki Modes';

  constructor(
    public resourceType: ResourceType,
    public resourceId: string
  ) {}
}

export class ToggleMode {
  static readonly type = '[Wiki] Toggle Mode';
  constructor(public mode: WikiModes) {}
}

export class GetWikiContent {
  static readonly type = '[Wiki] Get Wiki Content';

  constructor(public content: string) {}
}

export class UpdateWikiPreviewContent {
  static readonly type = '[Wiki] Update Wiki Content';

  constructor(public content: string) {}
}

export class SetCurrentWiki {
  static readonly type = '[Wiki] Set Current Wiki';

  constructor(public wikiId: string) {}
}

export class CreateWikiVersion {
  static readonly type = '[Wiki] Create Wiki Version';

  constructor(
    public wikiId: string,
    public content: string
  ) {}
}

export class GetWikiVersions {
  static readonly type = '[Wiki] Get Wiki Versions';

  constructor(public wikiId: string) {}
}
export class GetWikiVersionContent {
  static readonly type = '[Wiki] Get Wiki Version Content';

  constructor(
    public wikiId: string,
    public versionId: string
  ) {}
}

export class GetCompareVersionContent {
  static readonly type = '[Wiki] Get Compare Version Content';

  constructor(
    public wikiId: string,
    public versionId: string
  ) {}
}
