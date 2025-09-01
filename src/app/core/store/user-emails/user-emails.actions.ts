export class GetEmails {
  static readonly type = '[UserEmails] Get Emails';
}

export class AddEmail {
  static readonly type = '[UserEmails] Add Email';

  constructor(public email: string) {}
}

export class DeleteEmail {
  static readonly type = '[UserEmails] Remove Email';

  constructor(public emailId: string) {}
}

export class ResendConfirmation {
  static readonly type = '[UserEmails] Resend Confirmation';

  constructor(public emailId: string) {}
}

export class VerifyEmail {
  static readonly type = '[UserEmails] Verify Email';

  constructor(public emailId: string) {}
}

export class MakePrimary {
  static readonly type = '[UserEmails] Make Primary';

  constructor(public emailId: string) {}
}
