import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Subject } from 'rxjs';

import { Mock } from 'vitest';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ClearState, DeleteDraft, FetchProjectChildren, RegistriesSelectors } from '@osf/features/registries/store';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  ContributorsSelectors,
  GetAllContributors,
  LoadMoreContributors,
  ResetContributorsState,
} from '@osf/shared/stores/contributors';
import { FetchLicense, LicensesSelectors } from '@osf/shared/stores/licenses';
import { FetchSelectedSubjects, SubjectsSelectors } from '@osf/shared/stores/subjects';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import {
  CustomDialogServiceMockBuilder,
  CustomDialogServiceMockType,
} from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ReviewComponent } from './review.component';

const DEFAULT_DRAFT = {
  id: 'draft-1',
  providerId: 'prov-1',
  currentUserPermissions: [],
  hasProject: false,
  license: { id: 'lic-1', options: {} },
  branchedFrom: { id: 'proj-1', type: 'nodes' },
};

interface SetupOverrides extends BaseSetupOverrides {
  dialogCloseSubject?: Subject<unknown>;
}

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let store: Store;
  let mockRouter: RouterMockType;
  let mockDialog: CustomDialogServiceMockType;
  let mockToast: ToastServiceMockType;
  let mockConfirmation: CustomConfirmationServiceMockType;
  let dialogClose$: Subject<unknown>;

  function setup(overrides: SetupOverrides = {}) {
    mockRouter = RouterMockBuilder.create().withUrl('/registries/123/review').build();
    const mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build();

    dialogClose$ = overrides.dialogCloseSubject ?? new Subject<unknown>();
    mockDialog = CustomDialogServiceMockBuilder.create()
      .withOpen(
        vi.fn().mockReturnValue({
          onClose: dialogClose$.pipe(),
          close: vi.fn(),
        })
      )
      .build();

    mockToast = ToastServiceMock.simple();
    mockConfirmation = CustomConfirmationServiceMock.simple();

    const defaultSignals: SignalOverride[] = [
      { selector: RegistriesSelectors.getPagesSchema, value: [] },
      { selector: RegistriesSelectors.getDraftRegistration, value: DEFAULT_DRAFT },
      { selector: RegistriesSelectors.isDraftLoading, value: false },
      { selector: RegistriesSelectors.getStepsData, value: {} },
      { selector: RegistriesSelectors.getRegistrationComponents, value: [] },
      { selector: LicensesSelectors.getLicense, value: null },
      { selector: RegistriesSelectors.getRegistration, value: { id: 'new-reg-1' } },
      { selector: RegistriesSelectors.getStepsState, value: { 0: { invalid: false } } },
      { selector: RegistriesSelectors.hasDraftAdminAccess, value: true },
      { selector: ContributorsSelectors.getContributors, value: [] },
      { selector: ContributorsSelectors.isContributorsLoading, value: false },
      { selector: ContributorsSelectors.hasMoreContributors, value: false },
      { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
    ];

    TestBed.configureTestingModule({
      imports: [
        ReviewComponent,
        ...MockComponents(RegistrationBlocksDataComponent, ContributorsListComponent, LicenseDisplayComponent),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(CustomDialogService, mockDialog),
        MockProvider(CustomConfirmationService, mockConfirmation),
        MockProvider(ToastService, mockToast),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    const fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getContributors, getSubjects and fetchLicense on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(new GetAllContributors('draft-1', ResourceType.DraftRegistration));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSelectedSubjects('draft-1', ResourceType.DraftRegistration));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchLicense('lic-1'));
  });

  it('should navigate to previous step on goBack', () => {
    setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getPagesSchema, value: [{ id: '1' }, { id: '2' }] }],
    });

    component.goBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['../', 2],
      expect.objectContaining({ relativeTo: expect.anything() })
    );
  });

  it('should navigate to step 0 when pages is empty on goBack', () => {
    component.goBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['../', 0],
      expect.objectContaining({ relativeTo: expect.anything() })
    );
  });

  it('should dispatch deleteDraft and navigate on confirm', () => {
    mockConfirmation.confirmDelete.mockImplementation(({ onConfirm }) => onConfirm?.());
    (store.dispatch as Mock).mockClear();

    component.deleteDraft();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteDraft('draft-1'));
    expect(store.dispatch).toHaveBeenCalledWith(new ClearState());
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/registries/prov-1/new');
  });

  it('should open select components dialog when components exist', () => {
    setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getRegistrationComponents, value: [{ id: 'comp-1' }] }],
    });

    component.confirmRegistration();

    expect(mockDialog.open).toHaveBeenCalled();
    const firstCallArgs = (mockDialog.open as Mock).mock.calls[0];
    expect(firstCallArgs[1].header).toBe('registries.review.selectComponents.title');
  });

  it('should open confirm registration dialog when no components', () => {
    component.confirmRegistration();

    expect(mockDialog.open).toHaveBeenCalled();
    const firstCallArgs = (mockDialog.open as Mock).mock.calls[0];
    expect(firstCallArgs[1].header).toBe('registries.review.confirmation.title');
  });

  it('should show success toast and navigate on successful registration', () => {
    component.openConfirmRegistrationDialog();
    dialogClose$.next(true);

    expect(mockToast.showSuccess).toHaveBeenCalledWith('registries.review.confirmation.successMessage');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/new-reg-1/overview']);
  });

  it('should reopen select components dialog when confirm dialog closed with falsy result and components exist', () => {
    setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getRegistrationComponents, value: [{ id: 'comp-1' }] }],
    });

    component.openConfirmRegistrationDialog(['comp-1']);
    dialogClose$.next(false);

    expect(mockDialog.open).toHaveBeenCalledTimes(2);
  });

  it('should not navigate when confirm dialog closed with falsy result and no components', () => {
    component.openConfirmRegistrationDialog();
    dialogClose$.next(false);

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should pass selected components from select dialog to confirm dialog', () => {
    const selectClose$ = new Subject<unknown>();
    const confirmClose$ = new Subject<unknown>();
    let callCount = 0;

    setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getRegistrationComponents, value: [{ id: 'comp-1' }] }],
    });

    (mockDialog.open as Mock).mockImplementation(() => {
      callCount++;
      const subj = callCount === 1 ? selectClose$ : confirmClose$;
      return { onClose: subj.pipe(), close: vi.fn() };
    });

    component.openSelectComponentsForRegistrationDialog();
    selectClose$.next(['comp-1']);

    expect(mockDialog.open).toHaveBeenCalledTimes(2);
    const secondCallArgs = (mockDialog.open as Mock).mock.calls[1];
    expect(secondCallArgs[1].data.components).toEqual(['comp-1']);
  });

  it('should not open confirm dialog when select components dialog returns falsy', () => {
    const selectClose$ = new Subject<unknown>();

    setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getRegistrationComponents, value: [{ id: 'comp-1' }] }],
    });

    (mockDialog.open as Mock).mockReturnValue({
      onClose: selectClose$.pipe(),
      close: vi.fn(),
    });

    component.openSelectComponentsForRegistrationDialog();
    selectClose$.next(null);

    expect(mockDialog.open).toHaveBeenCalledTimes(1);
  });

  it('should dispatch loadMoreContributors', () => {
    (store.dispatch as Mock).mockClear();
    component.loadMoreContributors();
    expect(store.dispatch).toHaveBeenCalledWith(new LoadMoreContributors('draft-1', ResourceType.DraftRegistration));
  });

  it('should dispatch resetContributorsState on destroy', () => {
    (store.dispatch as Mock).mockClear();
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(new ResetContributorsState());
  });

  it('should compute isDraftInvalid as false when all steps are valid', () => {
    expect(component.isDraftInvalid()).toBe(false);
  });

  it('should compute isDraftInvalid as true when any step is invalid', () => {
    setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getStepsState, value: { 0: { invalid: true } } }],
    });
    expect(component.isDraftInvalid()).toBe(true);
  });

  it('should compute registerButtonDisabled as false when valid and has admin access', () => {
    expect(component.registerButtonDisabled()).toBe(false);
  });

  it('should compute registerButtonDisabled as true when draft is loading', () => {
    setup({
      selectorOverrides: [{ selector: RegistriesSelectors.isDraftLoading, value: true }],
    });
    expect(component.registerButtonDisabled()).toBe(true);
  });

  it('should compute registerButtonDisabled as true when draft is invalid', () => {
    setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getStepsState, value: { 0: { invalid: true } } }],
    });
    expect(component.registerButtonDisabled()).toBe(true);
  });

  it('should compute registerButtonDisabled as true when no admin access', () => {
    setup({
      selectorOverrides: [{ selector: RegistriesSelectors.hasDraftAdminAccess, value: false }],
    });
    expect(component.registerButtonDisabled()).toBe(true);
  });

  it('should compute licenseOptionsRecord from draft license options', () => {
    setup({
      selectorOverrides: [
        {
          selector: RegistriesSelectors.getDraftRegistration,
          value: { ...DEFAULT_DRAFT, license: { id: 'lic-1', options: { year: '2026', copyright: 'Test' } } },
        },
      ],
    });
    expect(component.licenseOptionsRecord()).toEqual({ year: '2026', copyright: 'Test' });
  });

  it('should compute licenseOptionsRecord as empty when no license options', () => {
    expect(component.licenseOptionsRecord()).toEqual({});
  });

  it('should pass draftId and providerId to confirm registration dialog data', () => {
    component.openConfirmRegistrationDialog();

    const callArgs = (mockDialog.open as Mock).mock.calls[0];
    expect(callArgs[1].data.draftId).toBe('draft-1');
    expect(callArgs[1].data.providerId).toBe('prov-1');
    expect(callArgs[1].data.projectId).toBe('proj-1');
  });

  it('should set projectId to null when branchedFrom type is not nodes', () => {
    setup({
      selectorOverrides: [
        {
          selector: RegistriesSelectors.getDraftRegistration,
          value: { ...DEFAULT_DRAFT, branchedFrom: { id: 'proj-1', type: 'registrations' } },
        },
      ],
    });

    component.openConfirmRegistrationDialog();

    const callArgs = (mockDialog.open as Mock).mock.calls[0];
    expect(callArgs[1].data.projectId).toBeNull();
  });

  it('should pass components array to confirm registration dialog', () => {
    component.openConfirmRegistrationDialog(['comp-1', 'comp-2']);

    const callArgs = (mockDialog.open as Mock).mock.calls[0];
    expect(callArgs[1].data.components).toEqual(['comp-1', 'comp-2']);
  });

  it('should not navigate after registration when newRegistration has no id', () => {
    setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getRegistration, value: { id: null } }],
    });

    component.openConfirmRegistrationDialog();
    dialogClose$.next(true);

    expect(mockToast.showSuccess).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should dispatch getProjectsComponents when draft hasProject is true', () => {
    setup({
      selectorOverrides: [
        {
          selector: RegistriesSelectors.getDraftRegistration,
          value: { ...DEFAULT_DRAFT, hasProject: true },
        },
      ],
    });

    expect(store.dispatch).toHaveBeenCalledWith(new FetchProjectChildren('proj-1'));
  });

  it('should dispatch getProjectsComponents with empty string when branchedFrom has no id', () => {
    setup({
      selectorOverrides: [
        {
          selector: RegistriesSelectors.getDraftRegistration,
          value: { ...DEFAULT_DRAFT, hasProject: true, branchedFrom: null },
        },
      ],
    });

    expect(store.dispatch).toHaveBeenCalledWith(new FetchProjectChildren(''));
  });
});
