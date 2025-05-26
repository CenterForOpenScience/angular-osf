export class GetHomeWiki {
  static readonly type = '[Wiki] Get Home Wiki';

  constructor(public projectId: string) {}
}

export class ClearWiki {
  static readonly type = '[Wiki] Clear Wiki';
}
