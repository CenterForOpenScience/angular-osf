import { StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { LicensesService } from '@osf/shared/services/licenses.service';

import { RegistrationsLicenseService } from '../../services/registrations-licenses.service';
import { SaveLicense } from '../registries.actions';
import { RegistriesStateModel } from '../registries.model';

@Injectable()
export class LicensesHandlers {
  registrationsLicenseService = inject(RegistrationsLicenseService);
  licensesService = inject(LicensesService);

  fetchLicenses(ctx: StateContext<RegistriesStateModel>, providerId: string) {
    ctx.patchState({
      licenses: {
        ...ctx.getState().licenses,
        isLoading: true,
      },
    });

    return this.licensesService.getLicenses(ResourceType.Registration, providerId).pipe(
      tap((licenses) => {
        ctx.patchState({
          licenses: {
            data: licenses,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'licenses', error))
    );
  }

  saveLicense(ctx: StateContext<RegistriesStateModel>, { registrationId, licenseId, licenseOptions }: SaveLicense) {
    const state = ctx.getState();
    ctx.patchState({
      draftRegistration: {
        ...state.draftRegistration,
        isLoading: true,
      },
    });

    return this.registrationsLicenseService.updateLicense(registrationId, licenseId, licenseOptions).pipe(
      tap((response) => {
        ctx.patchState({
          draftRegistration: {
            data: response,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'licenses', error))
    );
  }
}
