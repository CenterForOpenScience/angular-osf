import { SignUpModel } from '@osf/features/auth/models';

export class RegisterUser {
  static readonly type = '[Auth] Register User';

  constructor(public payload: SignUpModel) {}
}

export class ForgotPassword {
  static readonly type = '[Auth] Forgot password';

  constructor(public email: string) {}
}

export class ResetPassword {
  static readonly type = '[Auth] Reset Password';

  constructor(
    public userId: string,
    public token: string,
    public newPassword: string
  ) {}
}
