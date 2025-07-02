import { InjectionToken } from '@angular/core';

import { ISubjectsService } from '../models';

export const SUBJECTS_SERVICE = new InjectionToken<ISubjectsService>('SUBJECTS_SERVICE');
