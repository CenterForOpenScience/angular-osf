export class GetScopes {
  static readonly type = '[Tokens] Get Scopes';
}

export class GetTokens {
  static readonly type = '[Tokens] Get Tokens';
}

export class GetTokenById {
  static readonly type = '[Tokens] Get Token By Id';
  constructor(public tokenId: string) {}
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

export class CreateToken {
  static readonly type = '[Tokens] Create Token';
  constructor(
    public name: string,
    public scopes: string[],
  ) {}
}
