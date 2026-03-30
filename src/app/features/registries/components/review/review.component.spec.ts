import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Subject } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ClearState,
  DeleteDraft,
  FetchLicenses,
  FetchProjectChildren,
  RegistriesSelectors,
} from '@osf/features/registries/store';
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
import { FetchSelectedSubjects, SubjectsSelectors } from '@osf/shared/stores/subjects';

import { ReviewComponent } from './review.component';

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
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

const DEFAULT_DRAFT = {
  id: 'draft-1',
  providerId: 'prov-1',
  currentUserPermissions: [],
  hasProject: false,
  license: { options: {} },
  branchedFrom: { id: 'proj-1', type: 'nodes' },
};

function createDefaultSignals(overrides: { selector: any; value: any }[] = []) {
  const defaults = [
    { selector: RegistriesSelectors.getPagesSchema, value: [] },
    { selector: RegistriesSelectors.getDraftRegistration, value: DEFAULT_DRAFT },
    { selector: RegistriesSelectors.isDraftSubmitting, value: false },
    { selector: RegistriesSelectors.isDraftLoading, value: false },
    { selector: RegistriesSelectors.getStepsData, value: {} },
    { selector: RegistriesSelectors.getRegistrationComponents, value: [] },
    { selector: RegistriesSelectors.getRegistrationLicense, value: null },
    { selector: RegistriesSelectors.getRegistration, value: { id: 'new-reg-1' } },
    { selector: RegistriesSelectors.getStepsState, value: { 0: { invalid: false } } },
    { selector: RegistriesSelectors.hasDraftAdminAccess, value: true },
    { selector: ContributorsSelectors.getContributors, value: [] },
    { selector: ContributorsSelectors.isContributorsLoading, value: false },
    { selector: ContributorsSelectors.hasMoreContributors, value: false },
    { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
  ];

  return overrides.length
    ? defaults.map((s) => {
        const override = overrides.find((o) => o.selector === s.selector);
        return override ? { ...s, value: override.value } : s;
      })
    : defaults;
}

function setup(
  opts: {
    selectorOverrides?: { selector: any; value: any }[];
    dialogCloseSubject?: Subject<any>;
  } = {}
) {
  const mockRouter = RouterMockBuilder.create().withUrl('/registries/123/review').build();
  const mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build();

  const dialogClose$ = opts.dialogCloseSubject ?? new Subject<any>();
  const mockDialog = CustomDialogServiceMockBuilder.create()
    .withOpen(
      jest.fn().mockReturnValue({
        onClose: dialogClose$.pipe(),
        close: jest.fn(),
      })
    )
    .build();

  const mockToast = ToastServiceMock.simple();
  const mockConfirmation = CustomConfirmationServiceMock.simple();

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
      provideMockStore({ signals: createDefaultSignals(opts.selectorOverrides) }),
    ],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(ReviewComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component, store, mockRouter, mockDialog, mockToast, mockConfirmation, dialogClose$ };
}

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let store: Store;
  let mockRouter: RouterMockType;
  let mockDialog: CustomDialogServiceMockType;
  let mockToast: ToastServiceMockType;
  let mockConfirmation: CustomConfirmationServiceMockType;
  let dialogClose$: Subject<any>;

  beforeEach(() => {
    const result = setup();
    component = result.component;
    store = result.store;
    mockRouter = result.mockRouter;
    mockDialog = result.mockDialog;
    mockToast = result.mockToast;
    mockConfirmation = result.mockConfirmation;
    dialogClose$ = result.dialogClose$;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getContributors, getSubjects and fetchLicenses on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(new GetAllContributors('draft-1', ResourceType.DraftRegistration));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSelectedSubjects('draft-1', ResourceType.DraftRegistration));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchLicenses('prov-1'));
  });

  it('should navigate to previous step on goBack', () => {
    const { component: c, mockRouter: router } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getPagesSchema, value: [{ id: '1' }, { id: '2' }] }],
    });

    c.goBack();

    expect(router.navigate).toHaveBeenCalledWith(
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
    mockConfirmation.confirmDelete.mockImplementation(({ onConfirm }: any) => onConfirm());
    (store.dispatch as jest.Mock).mockClear();

    component.deleteDraft();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteDraft('draft-1'));
    expect(store.dispatch).toHaveBeenCalledWith(new ClearState());
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/registries/prov-1/new');
  });

  it('should open select components dialog when components exist', () => {
    const { component: c, mockDialog: dialog } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getRegistrationComponents, value: [{ id: 'comp-1' }] }],
    });

    c.confirmRegistration();

    expect(dialog.open).toHaveBeenCalled();
    const firstCallArgs = (dialog.open as jest.Mock).mock.calls[0];
    expect(firstCallArgs[1].header).toBe('registries.review.selectComponents.title');
  });

  it('should open confirm registration dialog when no components', () => {
    component.confirmRegistration();

    expect(mockDialog.open).toHaveBeenCalled();
    const firstCallArgs = (mockDialog.open as jest.Mock).mock.calls[0];
    expect(firstCallArgs[1].header).toBe('registries.review.confirmation.title');
  });

  it('should show success toast and navigate on successful registration', () => {
    component.openConfirmRegistrationDialog();
    dialogClose$.next(true);

    expect(mockToast.showSuccess).toHaveBeenCalledWith('registries.review.confirmation.successMessage');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/new-reg-1/overview']);
  });

  it('should reopen select components dialog when confirm dialog closed with falsy result and components exist', () => {
    const {
      component: c,
      mockDialog: dialog,
      dialogClose$: close$,
    } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getRegistrationComponents, value: [{ id: 'comp-1' }] }],
    });

    c.openConfirmRegistrationDialog(['comp-1']);
    close$.next(false);

    expect(dialog.open).toHaveBeenCalledTimes(2);
  });

  it('should not navigate when confirm dialog closed with falsy result and no components', () => {
    component.openConfirmRegistrationDialog();
    dialogClose$.next(false);

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should pass selected components from select dialog to confirm dialog', () => {
    const selectClose$ = new Subject<any>();
    const confirmClose$ = new Subject<any>();
    let callCount = 0;

    const { component: c, mockDialog: dialog } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getRegistrationComponents, value: [{ id: 'comp-1' }] }],
    });

    (dialog.open as jest.Mock).mockImplementation(() => {
      callCount++;
      const subj = callCount === 1 ? selectClose$ : confirmClose$;
      return { onClose: subj.pipe(), close: jest.fn() };
    });

    c.openSelectComponentsForRegistrationDialog();
    selectClose$.next(['comp-1']);

    expect(dialog.open).toHaveBeenCalledTimes(2);
    const secondCallArgs = (dialog.open as jest.Mock).mock.calls[1];
    expect(secondCallArgs[1].data.components).toEqual(['comp-1']);
  });

  it('should not open confirm dialog when select components dialog returns falsy', () => {
    const selectClose$ = new Subject<any>();

    const { component: c, mockDialog: dialog } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getRegistrationComponents, value: [{ id: 'comp-1' }] }],
    });

    (dialog.open as jest.Mock).mockReturnValue({
      onClose: selectClose$.pipe(),
      close: jest.fn(),
    });

    c.openSelectComponentsForRegistrationDialog();
    selectClose$.next(null);

    expect(dialog.open).toHaveBeenCalledTimes(1);
  });

  it('should dispatch loadMoreContributors', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.loadMoreContributors();
    expect(store.dispatch).toHaveBeenCalledWith(new LoadMoreContributors('draft-1', ResourceType.DraftRegistration));
  });

  it('should dispatch resetContributorsState on destroy', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(new ResetContributorsState());
  });

  it('should compute isDraftInvalid as false when all steps are valid', () => {
    expect(component.isDraftInvalid()).toBe(false);
  });

  it('should compute isDraftInvalid as true when any step is invalid', () => {
    const { component: c } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getStepsState, value: { 0: { invalid: true } } }],
    });
    expect(c.isDraftInvalid()).toBe(true);
  });

  it('should compute registerButtonDisabled as false when valid and has admin access', () => {
    expect(component.registerButtonDisabled()).toBe(false);
  });

  it('should compute registerButtonDisabled as true when draft is loading', () => {
    const { component: c } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.isDraftLoading, value: true }],
    });
    expect(c.registerButtonDisabled()).toBe(true);
  });

  it('should compute registerButtonDisabled as true when draft is invalid', () => {
    const { component: c } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getStepsState, value: { 0: { invalid: true } } }],
    });
    expect(c.registerButtonDisabled()).toBe(true);
  });

  it('should compute registerButtonDisabled as true when no admin access', () => {
    const { component: c } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.hasDraftAdminAccess, value: false }],
    });
    expect(c.registerButtonDisabled()).toBe(true);
  });

  it('should compute licenseOptionsRecord from draft license options', () => {
    const { component: c } = setup({
      selectorOverrides: [
        {
          selector: RegistriesSelectors.getDraftRegistration,
          value: { ...DEFAULT_DRAFT, license: { options: { year: '2026', copyright: 'Test' } } },
        },
      ],
    });
    expect(c.licenseOptionsRecord()).toEqual({ year: '2026', copyright: 'Test' });
  });

  it('should compute licenseOptionsRecord as empty when no license options', () => {
    expect(component.licenseOptionsRecord()).toEqual({});
  });

  it('should pass draftId and providerId to confirm registration dialog data', () => {
    component.openConfirmRegistrationDialog();

    const callArgs = (mockDialog.open as jest.Mock).mock.calls[0];
    expect(callArgs[1].data.draftId).toBe('draft-1');
    expect(callArgs[1].data.providerId).toBe('prov-1');
    expect(callArgs[1].data.projectId).toBe('proj-1');
  });

  it('should set projectId to null when branchedFrom type is not nodes', () => {
    const { component: c, mockDialog: dialog } = setup({
      selectorOverrides: [
        {
          selector: RegistriesSelectors.getDraftRegistration,
          value: { ...DEFAULT_DRAFT, branchedFrom: { id: 'proj-1', type: 'registrations' } },
        },
      ],
    });

    c.openConfirmRegistrationDialog();

    const callArgs = (dialog.open as jest.Mock).mock.calls[0];
    expect(callArgs[1].data.projectId).toBeNull();
  });

  it('should pass components array to confirm registration dialog', () => {
    component.openConfirmRegistrationDialog(['comp-1', 'comp-2']);

    const callArgs = (mockDialog.open as jest.Mock).mock.calls[0];
    expect(callArgs[1].data.components).toEqual(['comp-1', 'comp-2']);
  });

  it('should not navigate after registration when newRegistration has no id', () => {
    const {
      component: c,
      mockRouter: router,
      mockToast: toast,
      dialogClose$: close$,
    } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getRegistration, value: { id: null } }],
    });

    c.openConfirmRegistrationDialog();
    close$.next(true);

    expect(toast.showSuccess).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should dispatch getProjectsComponents when draft hasProject is true', () => {
    const { store: s } = setup({
      selectorOverrides: [
        {
          selector: RegistriesSelectors.getDraftRegistration,
          value: { ...DEFAULT_DRAFT, hasProject: true },
        },
      ],
    });

    expect(s.dispatch).toHaveBeenCalledWith(new FetchProjectChildren('proj-1'));
  });

  it('should dispatch getProjectsComponents with empty string when branchedFrom has no id', () => {
    const { store: s } = setup({
      selectorOverrides: [
        {
          selector: RegistriesSelectors.getDraftRegistration,
          value: { ...DEFAULT_DRAFT, hasProject: true, branchedFrom: null },
        },
      ],
    });

    expect(s.dispatch).toHaveBeenCalledWith(new FetchProjectChildren(''));
  });

  it('should not dispatch getProjectsComponents when isDraftSubmitting is true', () => {
    const { store: s } = setup({
      selectorOverrides: [
        { selector: RegistriesSelectors.isDraftSubmitting, value: true },
        {
          selector: RegistriesSelectors.getDraftRegistration,
          value: { ...DEFAULT_DRAFT, hasProject: true },
        },
      ],
    });

    expect(s.dispatch).not.toHaveBeenCalledWith(expect.any(FetchProjectChildren));
  });
});
