export class SetAuthToken {
  static readonly type = '[Auth] Set Auth Token';

  constructor(public accessToken: string) {}
}

export class ClearAuth {
  static readonly type = '[Auth] Clear Auth';
}
