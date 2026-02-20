import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of, Subject } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistrationOverviewModel } from '@osf/features/registry/models';
import { DataResourcesComponent } from '@osf/shared/components/data-resources/data-resources.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { ArchivingMessageComponent } from '../../components/archiving-message/archiving-message.component';
import { RegistrationOverviewToolbarComponent } from '../../components/registration-overview-toolbar/registration-overview-toolbar.component';
import { RegistryBlocksSectionComponent } from '../../components/registry-blocks-section/registry-blocks-section.component';
import { RegistryMakeDecisionComponent } from '../../components/registry-make-decision/registry-make-decision.component';
import { RegistryOverviewMetadataComponent } from '../../components/registry-overview-metadata/registry-overview-metadata.component';
import { RegistryRevisionsComponent } from '../../components/registry-revisions/registry-revisions.component';
import { RegistryStatusesComponent } from '../../components/registry-statuses/registry-statuses.component';
import { WithdrawnMessageComponent } from '../../components/withdrawn-message/withdrawn-message.component';
import { RegistrySelectors } from '../../store/registry';

import { RegistryOverviewComponent } from './registry-overview.component';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { createMockSchemaResponse } from '@testing/mocks/schema-response.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMock } from '@testing/providers/custom-dialog-provider.mock';
import { LoaderServiceMock, provideLoaderServiceMock } from '@testing/providers/loader-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';
import { ViewOnlyLinkHelperMock } from '@testing/providers/view-only-link-helper.mock';

interface SetupOverrides {
  registry?: RegistrationOverviewModel | null;
  schemaResponses?: SchemaResponse[];
  queryParams?: Record<string, string>;
  hasViewOnly?: boolean;
  registryId?: string;
}

function setup(overrides: SetupOverrides = {}) {
  const registryId = overrides.registryId ?? 'registry-1';
  const registry = overrides.registry ?? null;
  const schemaResponses = overrides.schemaResponses ?? [];

  const mockRouter = RouterMockBuilder.create().withUrl('/registries/registry-1').build();
  const mockActivatedRoute = ActivatedRouteMockBuilder.create()
    .withParams({ id: registryId })
    .withQueryParams(overrides.queryParams ?? {})
    .build();

  const mockDialogService = CustomDialogServiceMock.simple();
  const mockLoaderService = new LoaderServiceMock();
  const mockToastService = ToastServiceMock.simple();
  const mockViewOnlyHelper = ViewOnlyLinkHelperMock.simple(overrides.hasViewOnly);

  TestBed.configureTestingModule({
    imports: [
      RegistryOverviewComponent,
      ...MockComponents(
        SubHeaderComponent,
        LoadingSpinnerComponent,
        RegistryOverviewMetadataComponent,
        RegistryRevisionsComponent,
        RegistryStatusesComponent,
        DataResourcesComponent,
        ArchivingMessageComponent,
        WithdrawnMessageComponent,
        ViewOnlyLinkMessageComponent,
        RegistrationOverviewToolbarComponent,
        RegistryBlocksSectionComponent
      ),
    ],
    providers: [
      provideOSFCore(),
      MockProvider(ActivatedRoute, mockActivatedRoute),
      MockProvider(Router, mockRouter),
      MockProvider(CustomDialogService, mockDialogService),
      provideLoaderServiceMock(mockLoaderService),
      MockProvider(ToastService, mockToastService),
      MockProvider(ViewOnlyLinkHelperService, mockViewOnlyHelper),
      provideMockStore({
        signals: [
          { selector: RegistrySelectors.getRegistry, value: registry },
          { selector: RegistrySelectors.isRegistryLoading, value: false },
          { selector: RegistrySelectors.isRegistryAnonymous, value: false },
          { selector: RegistrySelectors.getSchemaResponses, value: schemaResponses },
          { selector: RegistrySelectors.isSchemaResponsesLoading, value: false },
          { selector: RegistrySelectors.getSchemaBlocks, value: [] },
          { selector: RegistrySelectors.isSchemaBlocksLoading, value: false },
          { selector: RegistrySelectors.areReviewActionsLoading, value: false },
          { selector: RegistrySelectors.getSchemaResponse, value: schemaResponses[0] ?? null },
          { selector: RegistrySelectors.hasAdminAccess, value: false },
        ],
      }),
    ],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(RegistryOverviewComponent);
  fixture.detectChanges();

  return {
    fixture,
    component: fixture.componentInstance,
    store,
    mockRouter,
    mockDialogService,
    mockLoaderService,
    mockToastService,
  };
}

describe('RegistryOverviewComponent', () => {
  it('should create with default state', () => {
    const { component } = setup({ registry: MOCK_REGISTRATION_OVERVIEW_MODEL });

    expect(component).toBeTruthy();
    expect(component.selectedRevisionIndex()).toBe(0);
    expect(component.isModeration()).toBe(false);
    expect(component.revisionId()).toBeNull();
  });

  it('should derive isModeration and revisionId from query params', () => {
    const { component } = setup({
      registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
      queryParams: { revisionId: 'rev-1', mode: 'moderator' },
    });

    expect(component.revisionId()).toBe('rev-1');
    expect(component.isModeration()).toBe(true);
  });

  it('should compute showToolbar as false when archiving', () => {
    const { component } = setup({ registry: { ...MOCK_REGISTRATION_OVERVIEW_MODEL, archiving: true } });

    expect(component.showToolbar()).toBe(false);
  });

  it('should compute showToolbar as false when withdrawn', () => {
    const { component } = setup({ registry: { ...MOCK_REGISTRATION_OVERVIEW_MODEL, withdrawn: true } });

    expect(component.showToolbar()).toBe(false);
  });

  it('should compute showToolbar as true for normal registry', () => {
    const { component } = setup({ registry: MOCK_REGISTRATION_OVERVIEW_MODEL });

    expect(component.showToolbar()).toBe(true);
  });

  it('should compute canMakeDecision when in moderation mode and not archiving/withdrawn', () => {
    const { component } = setup({
      registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
      queryParams: { mode: 'moderator' },
    });

    expect(component.canMakeDecision()).toBe(true);
  });

  it('should compute canMakeDecision as false when archiving even in moderator mode', () => {
    const { component } = setup({
      registry: { ...MOCK_REGISTRATION_OVERVIEW_MODEL, archiving: true },
      queryParams: { mode: 'moderator' },
    });

    expect(component.canMakeDecision()).toBe(false);
  });

  it('should compute isInitialState from reviewsState', () => {
    const { component } = setup({
      registry: { ...MOCK_REGISTRATION_OVERVIEW_MODEL, reviewsState: RegistrationReviewStates.Initial },
    });

    expect(component.isInitialState()).toBe(true);
  });

  it('should compute isRootRegistration when rootParentId matches id', () => {
    const { component } = setup({
      registry: { ...MOCK_REGISTRATION_OVERVIEW_MODEL, rootParentId: MOCK_REGISTRATION_OVERVIEW_MODEL.id },
    });

    expect(component.isRootRegistration()).toBe(true);
  });

  it('should compute isRootRegistration when rootParentId is null', () => {
    const { component } = setup({
      registry: { ...MOCK_REGISTRATION_OVERVIEW_MODEL, rootParentId: undefined },
    });

    expect(component.isRootRegistration()).toBe(true);
  });

  it('should compute hasViewOnly from ViewOnlyLinkHelperService', () => {
    const { component } = setup({ registry: MOCK_REGISTRATION_OVERVIEW_MODEL, hasViewOnly: true });

    expect(component.hasViewOnly()).toBe(true);
  });

  it('should compute revisionInProgress from schemaResponses', () => {
    const schemaResponses = [
      createMockSchemaResponse('rev-1', RevisionReviewStates.Approved),
      createMockSchemaResponse('rev-2', RevisionReviewStates.RevisionInProgress),
    ];
    const { component } = setup({ registry: MOCK_REGISTRATION_OVERVIEW_MODEL, schemaResponses });

    expect(component.revisionInProgress()?.id).toBe('rev-2');
  });

  it('should compute schemaResponse based on selectedRevisionIndex', () => {
    const schemaResponses = [
      createMockSchemaResponse('rev-1', RevisionReviewStates.Approved),
      createMockSchemaResponse('rev-2', RevisionReviewStates.Approved),
    ];
    const { component } = setup({ registry: MOCK_REGISTRATION_OVERVIEW_MODEL, schemaResponses });

    expect(component.schemaResponse()?.id).toBe('rev-1');

    component.openRevision(1);

    expect(component.schemaResponse()?.id).toBe('rev-2');
  });

  it('should dispatch init actions when registryId is available', () => {
    const { store } = setup({ registryId: 'reg-1', registry: MOCK_REGISTRATION_OVERVIEW_MODEL });

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should dispatch schema actions when registry exists and is not withdrawn', () => {
    const { store } = setup({ registry: MOCK_REGISTRATION_OVERVIEW_MODEL });

    const calls = (store.dispatch as jest.Mock).mock.calls.map((c) => c[0]);
    const hasSchemaResponses = calls.some((a) => a.constructor?.name === 'GetRegistrySchemaResponses');

    expect(hasSchemaResponses).toBe(true);
  });

  it('should not dispatch schema actions when registry is withdrawn', () => {
    const { store } = setup({ registry: { ...MOCK_REGISTRATION_OVERVIEW_MODEL, withdrawn: true } });

    const calls = (store.dispatch as jest.Mock).mock.calls.map((c) => c[0]);
    const hasSchemaResponses = calls.some((a) => a.constructor?.name === 'GetRegistrySchemaResponses');

    expect(hasSchemaResponses).toBe(false);
  });

  it('should call loaderService.show and navigate on onUpdateRegistration', () => {
    const currentRevision = createMockSchemaResponse('new-rev', RevisionReviewStates.RevisionInProgress);
    const { component, store, mockRouter, mockLoaderService } = setup({
      registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
      schemaResponses: [currentRevision],
    });
    jest.spyOn(store, 'dispatch').mockReturnValue(of(undefined));

    component.onUpdateRegistration('registry-1');

    expect(mockLoaderService.show).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries/revisions/new-rev/justification']);
  });

  it('should navigate to justification on onContinueUpdateRegistration for approved revision', () => {
    const schemaResponses = [createMockSchemaResponse('rev-1', RevisionReviewStates.RevisionInProgress)];
    const { component, mockRouter } = setup({
      registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
      schemaResponses,
    });

    component.onContinueUpdateRegistration();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries/revisions/rev-1/justification']);
  });

  it('should not navigate on onContinueUpdateRegistration when no revisionInProgress', () => {
    const { component, mockRouter } = setup({ registry: MOCK_REGISTRATION_OVERVIEW_MODEL });
    (mockRouter.navigate as jest.Mock).mockClear();

    component.onContinueUpdateRegistration();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should not open dialog when registry id is falsy', () => {
    const { component, store, mockDialogService } = setup({
      registry: { ...MOCK_REGISTRATION_OVERVIEW_MODEL, id: '' },
    });
    jest.spyOn(store, 'dispatch').mockClear();

    component.handleOpenMakeDecisionDialog();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(mockDialogService.open).not.toHaveBeenCalled();
  });

  it('should open make decision dialog and handle success response', () => {
    const onCloseSubject = new Subject<any>();
    const { component, store, mockDialogService, mockToastService, mockRouter } = setup({
      registry: { ...MOCK_REGISTRATION_OVERVIEW_MODEL, id: 'reg-1' },
      queryParams: { revisionId: 'rev-1' },
    });
    jest.spyOn(store, 'dispatch').mockReturnValue(of(undefined));
    mockDialogService.open.mockReturnValue({ onClose: onCloseSubject.asObservable() } as any);

    component.handleOpenMakeDecisionDialog();

    expect(mockDialogService.open).toHaveBeenCalledWith(
      RegistryMakeDecisionComponent,
      expect.objectContaining({ data: expect.objectContaining({ revisionId: 'rev-1' }) })
    );

    onCloseSubject.next({ action: 'accept_submission' });

    expect(mockToastService.showSuccess).toHaveBeenCalledWith('moderation.makeDecision.acceptSubmissionSuccess');
    expect(mockRouter.navigateByUrl).toHaveBeenCalled();
  });
});
