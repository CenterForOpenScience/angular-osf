export class GetScopes {
  static readonly type = '[Tokens] Get Scopes';
}

export class GetTokens {
  static readonly type = '[Tokens] Get Tokens';
}

export class UpdateToken {
  static readonly type = '[Tokens] Update Token';
  constructor(
    public tokenId: string,
    public name: string,
    public scopes: string[],
  ) {}
}

export class DeleteToken {
  static readonly type = '[Tokens] Delete Token';
  constructor(public tokenId: string) {}
}
