import { HttpContextToken } from '@angular/common/http';

export const BYPASS_ERROR_INTERCEPTOR = new HttpContextToken<boolean>(() => false);
