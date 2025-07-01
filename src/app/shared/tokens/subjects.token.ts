import { InjectionToken } from '@angular/core';

import { ISubjectsService } from '../models/subject/subject-service.model';

export const SUBJECTS_SERVICE = new InjectionToken<ISubjectsService>('SUBJECTS_SERVICE');
