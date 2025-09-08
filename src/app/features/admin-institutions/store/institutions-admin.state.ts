import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { Institution } from '@osf/shared/models';
import { InstitutionsService } from '@osf/shared/services';

import { InstitutionRegistration } from '../models';
import { InstitutionsAdminService } from '../services/institutions-admin.service';

import {
  FetchHasOsfAddonSearch,
  FetchInstitutionById,
  FetchInstitutionDepartments,
  FetchInstitutionSearchResults,
  FetchInstitutionSummaryMetrics,
  FetchInstitutionUsers,
  FetchRegistrations,
  FetchStorageRegionSearch,
  RequestProjectAccess,
  SendUserMessage,
} from './institutions-admin.actions';
import { INSTITUTIONS_ADMIN_STATE_DEFAULTS, InstitutionsAdminModel } from './institutions-admin.model';

@State<InstitutionsAdminModel>({
  name: 'institutionsAdmin',
  defaults: INSTITUTIONS_ADMIN_STATE_DEFAULTS,
})
@Injectable()
export class InstitutionsAdminState {
  private readonly institutionsService = inject(InstitutionsService);
  private readonly institutionsAdminService = inject(InstitutionsAdminService);

  @Action(FetchInstitutionById)
  fetchInstitutionById(ctx: StateContext<InstitutionsAdminModel>, action: FetchInstitutionById) {
    ctx.patchState({ institution: { data: {} as Institution, isLoading: true, error: null } });

    return this.institutionsService.getInstitutionById(action.institutionId).pipe(
      tap((response) => {
        ctx.setState(
          patch({
            institution: patch({ data: response, error: null, isLoading: false }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'institution', error))
    );
  }

  @Action(FetchInstitutionDepartments)
  fetchDepartments(ctx: StateContext<InstitutionsAdminModel>, action: FetchInstitutionDepartments) {
    const state = ctx.getState();
    ctx.patchState({
      departments: { ...state.departments, isLoading: true, error: null },
    });

    return this.institutionsAdminService.fetchDepartments(action.institutionId).pipe(
      tap((response) => {
        ctx.patchState({
          departments: { data: response, isLoading: false, error: null },
        });
      }),

      catchError((error) => handleSectionError(ctx, 'departments', error))
    );
  }

  @Action(FetchInstitutionSummaryMetrics)
  fetchSummaryMetrics(ctx: StateContext<InstitutionsAdminModel>, action: FetchInstitutionSummaryMetrics) {
    const state = ctx.getState();
    ctx.patchState({
      summaryMetrics: { ...state.summaryMetrics, isLoading: true, error: null },
    });

    return this.institutionsAdminService.fetchSummary(action.institutionId).pipe(
      tap((response) => {
        ctx.patchState({
          summaryMetrics: { data: response, isLoading: false, error: null },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'summaryMetrics', error))
    );
  }

  @Action(FetchInstitutionSearchResults)
  fetchSearchResults(ctx: StateContext<InstitutionsAdminModel>, action: FetchInstitutionSearchResults) {
    const state = ctx.getState();
    ctx.patchState({
      searchResults: { ...state.searchResults, isLoading: true, error: null },
    });

    return this.institutionsAdminService
      .fetchIndexValueSearch(action.institutionId, action.valueSearchPropertyPath, action.additionalParams)
      .pipe(
        tap((response) => {
          ctx.patchState({
            searchResults: { data: response, isLoading: false, error: null },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'searchResults', error))
      );
  }

  @Action(FetchHasOsfAddonSearch)
  fetchHasOsfAddonSearch(ctx: StateContext<InstitutionsAdminModel>, action: FetchHasOsfAddonSearch) {
    const state = ctx.getState();
    ctx.patchState({
      hasOsfAddonSearch: { ...state.hasOsfAddonSearch, isLoading: true, error: null },
    });

    return this.institutionsAdminService.fetchIndexValueSearch(action.institutionId, 'hasOsfAddon').pipe(
      tap((response) => {
        ctx.patchState({
          hasOsfAddonSearch: { data: response, isLoading: false, error: null },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'hasOsfAddonSearch', error))
    );
  }

  @Action(FetchStorageRegionSearch)
  fetchStorageRegionSearch(ctx: StateContext<InstitutionsAdminModel>, action: FetchStorageRegionSearch) {
    const state = ctx.getState();
    ctx.patchState({
      storageRegionSearch: { ...state.storageRegionSearch, isLoading: true, error: null },
    });

    return this.institutionsAdminService.fetchIndexValueSearch(action.institutionId, 'storageRegion').pipe(
      tap((response) => {
        ctx.patchState({
          storageRegionSearch: { data: response, isLoading: false, error: null },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'storageRegionSearch', error))
    );
  }

  @Action(FetchInstitutionUsers)
  fetchUsers(ctx: StateContext<InstitutionsAdminModel>, action: FetchInstitutionUsers) {
    const state = ctx.getState();
    ctx.patchState({
      users: { ...state.users, isLoading: true, error: null },
    });

    return this.institutionsAdminService
      .fetchUsers(action.institutionId, action.page, action.pageSize, action.sort, action.filters)
      .pipe(
        tap((response) => {
          ctx.patchState({
            users: { data: response.users, totalCount: response.totalCount, isLoading: false, error: null },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'users', error))
      );
  }

  @Action(FetchRegistrations)
  fetchRegistrations(ctx: StateContext<InstitutionsAdminModel>, action: FetchRegistrations) {
    const state = ctx.getState();
    ctx.patchState({
      registrations: { ...state.registrations, isLoading: true, error: null },
    });

    const institutionIris = state.institution.data.iris;
    return this.institutionsAdminService.fetchRegistrations(institutionIris, action.sort, action.cursor).pipe(
      tap((response) => {
        ctx.patchState({
          registrations: {
            data: response.items as InstitutionRegistration[],
            totalCount: response.totalCount,
            isLoading: false,
            error: null,
            links: response.links,
            downloadLink: response.downloadLink,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'registrations', error))
    );
  }

  @Action(SendUserMessage)
  sendUserMessage(ctx: StateContext<InstitutionsAdminModel>, action: SendUserMessage) {
    return this.institutionsAdminService
      .sendMessage({
        userId: action.userId,
        institutionId: action.institutionId,
        messageText: action.messageText,
        bccSender: action.bccSender,
        replyTo: action.replyTo,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  @Action(RequestProjectAccess)
  requestProjectAccess(ctx: StateContext<InstitutionsAdminModel>, action: RequestProjectAccess) {
    return this.institutionsAdminService
      .requestProjectAccess(action.payload)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
