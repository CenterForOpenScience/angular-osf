import { HttpContext, HttpContextToken } from '@angular/common/http';

export const BYPASS_ERROR_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

export function bypassErrorInterceptorContext(): HttpContext {
  return new HttpContext().set(BYPASS_ERROR_INTERCEPTOR, true);
}
