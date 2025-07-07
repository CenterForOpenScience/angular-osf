import { StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/core/handlers';

import { RegistrationSubjectsService } from '../../services';
import { FetchRegistrationSubjects, UpdateRegistrationSubjects } from '../registries.actions';
import { RegistriesStateModel } from '../registries.model';

@Injectable()
export class SubjectsHandlers {
  subjectsService = inject(RegistrationSubjectsService);

  fetchRegistrationSubjects(ctx: StateContext<RegistriesStateModel>, { registrationId }: FetchRegistrationSubjects) {
    ctx.patchState({
      registrationSubjects: {
        ...ctx.getState().registrationSubjects,
        isLoading: true,
        error: null,
      },
    });

    return this.subjectsService.getRegistrationSubjects(registrationId).pipe(
      tap((subjects) => {
        ctx.patchState({
          registrationSubjects: {
            data: subjects,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'registrationSubjects', error))
    );
  }

  updateRegistrationSubjects(
    ctx: StateContext<RegistriesStateModel>,
    { registrationId, subjects }: UpdateRegistrationSubjects
  ) {
    ctx.patchState({
      registrationSubjects: {
        ...ctx.getState().registrationSubjects,
        isLoading: true,
        error: null,
      },
    });
    return this.subjectsService.updateRegistrationSubjects(registrationId, subjects).pipe(
      tap(() => {
        ctx.patchState({
          registrationSubjects: {
            data: subjects,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'registrationSubjects', error))
    );
  }
}
