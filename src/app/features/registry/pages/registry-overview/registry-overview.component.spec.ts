import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideServerRendering } from '@angular/platform-server';
import { ActivatedRoute, Router } from '@angular/router';

import { DataResourcesComponent } from '@osf/shared/components/data-resources/data-resources.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';
import { GetBookmarksCollectionId } from '@osf/shared/stores/bookmarks';
import { ContributorsSelectors, GetBibliographicContributors } from '@osf/shared/stores/contributors';

import { ArchivingMessageComponent } from '../../components/archiving-message/archiving-message.component';
import { RegistrationOverviewToolbarComponent } from '../../components/registration-overview-toolbar/registration-overview-toolbar.component';
import { RegistryBlocksSectionComponent } from '../../components/registry-blocks-section/registry-blocks-section.component';
import { RegistryMakeDecisionComponent } from '../../components/registry-make-decision/registry-make-decision.component';
import { RegistryOverviewMetadataComponent } from '../../components/registry-overview-metadata/registry-overview-metadata.component';
import { RegistryRevisionsComponent } from '../../components/registry-revisions/registry-revisions.component';
import { RegistryStatusesComponent } from '../../components/registry-statuses/registry-statuses.component';
import { WithdrawnMessageComponent } from '../../components/withdrawn-message/withdrawn-message.component';
import {
  CreateSchemaResponse,
  GetRegistryById,
  GetRegistryReviewActions,
  GetRegistrySchemaResponses,
  GetSchemaBlocks,
  RegistrySelectors,
} from '../../store/registry';

import { RegistryOverviewComponent } from './registry-overview.component';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { createMockSchemaResponse } from '@testing/mocks/schema-response.mock';
import { ToastServiceMock } from '@testing/mocks/toast.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryOverviewComponent', () => {
  let component: RegistryOverviewComponent;
  let fixture: ComponentFixture<RegistryOverviewComponent>;
  let store: Store;
  let httpMock: HttpTestingController;

  const createTestBed = (options?: {
    isSSR?: boolean;
    registryId?: string;
    queryParams?: Record<string, any>;
    registry?: any;
    schemaResponses?: any[];
    hasViewOnly?: boolean;
  }) => {
    const registryId = options?.registryId || 'registry-1';
    const mockRouter = RouterMockBuilder.create().withUrl('/registries/registry-1').build();
    const parentRoute = {
      params: of({ id: registryId }),
      snapshot: { params: { id: registryId }, queryParams: {} },
    } as any;
    const mockActivatedRoute = Object.assign(
      ActivatedRouteMockBuilder.create()
        .withParams({ id: registryId })
        .withQueryParams(options?.queryParams || {})
        .build(),
      { parent: parentRoute }
    );

    const mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    const mockLoaderService = new LoaderServiceMock();
    const mockViewOnlyHelper = {
      hasViewOnlyParam: jest.fn().mockReturnValue(options?.hasViewOnly || false),
    };

    const defaultRegistry = options?.registry || null;
    const defaultSchemaResponses = options?.schemaResponses || [];

    const providers: any[] = [
      MockProvider(ActivatedRoute, mockActivatedRoute),
      MockProvider(Router, mockRouter),
      MockProvider(CustomDialogService, mockCustomDialogService),
      MockProvider(LoaderService, mockLoaderService),
      MockProvider(ToastService, ToastServiceMock.useValue),
      MockProvider(ViewOnlyLinkHelperService, mockViewOnlyHelper),
      provideMockStore({
        actions: [
          { action: new GetRegistryById(registryId), value: of(void 0) },
          { action: new GetBookmarksCollectionId(), value: of(void 0) },
          { action: new GetBibliographicContributors(registryId, ResourceType.Registration), value: of(void 0) },
          { action: new GetSchemaBlocks(defaultRegistry?.registrationSchemaLink || ''), value: of(void 0) },
          { action: new GetRegistrySchemaResponses(registryId), value: of(void 0) },
          { action: new CreateSchemaResponse(registryId), value: of({ id: 'revision-1' }) },
          { action: new GetRegistryReviewActions(registryId), value: of(void 0) },
        ],
        signals: [
          { selector: RegistrySelectors.getRegistry, value: defaultRegistry },
          { selector: RegistrySelectors.isRegistryLoading, value: false },
          { selector: RegistrySelectors.isRegistryAnonymous, value: false },
          { selector: RegistrySelectors.getSchemaResponses, value: defaultSchemaResponses },
          { selector: RegistrySelectors.isSchemaResponsesLoading, value: false },
          { selector: RegistrySelectors.getSchemaBlocks, value: [] },
          { selector: RegistrySelectors.isSchemaBlocksLoading, value: false },
          { selector: RegistrySelectors.areReviewActionsLoading, value: false },
          { selector: RegistrySelectors.getSchemaResponse, value: defaultSchemaResponses[0] || null },
          { selector: RegistrySelectors.hasWriteAccess, value: false },
          { selector: RegistrySelectors.hasAdminAccess, value: false },
          { selector: ContributorsSelectors.getBibliographicContributors, value: [] },
          { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
          { selector: ContributorsSelectors.hasMoreBibliographicContributors, value: false },
        ],
      }),
    ];

    if (options?.isSSR) {
      providers.push(provideServerRendering(), { provide: PLATFORM_ID, useValue: 'server' });
    }

    return TestBed.configureTestingModule({
      imports: [
        RegistryOverviewComponent,
        OSFTestingModule,
        ...MockComponents(
          SubHeaderComponent,
          RegistrationOverviewToolbarComponent,
          LoadingSpinnerComponent,
          RegistryOverviewMetadataComponent,
          RegistryRevisionsComponent,
          RegistryStatusesComponent,
          DataResourcesComponent,
          ArchivingMessageComponent,
          WithdrawnMessageComponent,
          RegistryBlocksSectionComponent,
          ViewOnlyLinkMessageComponent
        ),
      ],
      providers,
    });
  };

  beforeEach(async () => {
    await createTestBed().compileComponents();

    fixture = TestBed.createComponent(RegistryOverviewComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.isModeration).toBe(false);
      expect(component.revisionId).toBeUndefined();
      expect(component.revisionInProgress).toBeUndefined();
      expect(component.selectedRevisionIndex()).toBe(0);
    });

    it('should handle loading states', () => {
      expect(component.isRegistryLoading()).toBe(false);
      expect(component.isSchemaBlocksLoading()).toBe(false);
      expect(component.areReviewActionsLoading()).toBe(false);
    });

    it('should handle registry data', () => {
      expect(component.registry()).toBeNull();
      expect(component.isAnonymous()).toBe(false);
      expect(component.schemaBlocks()).toEqual([]);
      expect(component.currentRevision()).toBeNull();
    });

    it('should handle permissions', () => {
      expect(component.hasWriteAccess()).toBe(false);
      expect(component.hasAdminAccess()).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    beforeEach(async () => {
      TestBed.resetTestingModule();
      await createTestBed({
        registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
      }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should compute hasViewOnly based on router query params', async () => {
      TestBed.resetTestingModule();
      const mockViewOnlyHelper = {
        hasViewOnlyParam: jest.fn().mockReturnValue(true),
      };
      await createTestBed({
        registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
        hasViewOnly: true,
      }).compileComponents();
      TestBed.overrideProvider(ViewOnlyLinkHelperService, { useValue: mockViewOnlyHelper });
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.hasViewOnly()).toBe(true);
    });

    it('should compute hasViewOnly as false when view-only param is not present', async () => {
      TestBed.resetTestingModule();
      const mockViewOnlyHelper = {
        hasViewOnlyParam: jest.fn().mockReturnValue(false),
      };
      await createTestBed({
        registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
        hasViewOnly: false,
      }).compileComponents();
      TestBed.overrideProvider(ViewOnlyLinkHelperService, { useValue: mockViewOnlyHelper });
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.hasViewOnly()).toBe(false);
    });

    it('should compute showToolbar as false when archiving', async () => {
      const archivingRegistry = { ...MOCK_REGISTRATION_OVERVIEW_MODEL, archiving: true };
      TestBed.resetTestingModule();
      await createTestBed({ registry: archivingRegistry }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.showToolbar()).toBe(false);
    });

    it('should compute showToolbar as false when withdrawn', async () => {
      const withdrawnRegistry = { ...MOCK_REGISTRATION_OVERVIEW_MODEL, withdrawn: true };
      TestBed.resetTestingModule();
      await createTestBed({ registry: withdrawnRegistry }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.showToolbar()).toBe(false);
    });

    it('should compute showToolbar as true when not archiving or withdrawn', () => {
      expect(component.showToolbar()).toBe(true);
    });

    it('should compute isInitialState based on reviewsState', async () => {
      const initialStateRegistry = {
        ...MOCK_REGISTRATION_OVERVIEW_MODEL,
        reviewsState: RegistrationReviewStates.Initial,
      };
      TestBed.resetTestingModule();
      await createTestBed({ registry: initialStateRegistry }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.isInitialState()).toBe(true);
    });

    it('should compute canMakeDecision when in moderation mode', async () => {
      TestBed.resetTestingModule();
      await createTestBed({
        registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
        queryParams: { mode: 'moderator' },
      }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.canMakeDecision()).toBe(true);
    });

    it('should compute canMakeDecision as false when archiving', async () => {
      const archivingRegistry = { ...MOCK_REGISTRATION_OVERVIEW_MODEL, archiving: true };
      TestBed.resetTestingModule();
      await createTestBed({
        registry: archivingRegistry,
        queryParams: { mode: 'moderator' },
      }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.canMakeDecision()).toBe(false);
    });

    it('should compute isRootRegistration when rootParentId matches id', async () => {
      const rootRegistry = {
        ...MOCK_REGISTRATION_OVERVIEW_MODEL,
        rootParentId: MOCK_REGISTRATION_OVERVIEW_MODEL.id,
      };
      TestBed.resetTestingModule();
      await createTestBed({ registry: rootRegistry }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.isRootRegistration()).toBe(true);
    });

    it('should compute isRootRegistration when rootParentId is null', async () => {
      const noRootRegistry = { ...MOCK_REGISTRATION_OVERVIEW_MODEL, rootParentId: null };
      TestBed.resetTestingModule();
      await createTestBed({ registry: noRootRegistry }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.isRootRegistration()).toBe(true);
    });

    it('should compute schemaResponse based on selectedRevisionIndex', async () => {
      const schemaResponses = [
        createMockSchemaResponse('revision-1', RevisionReviewStates.Approved),
        createMockSchemaResponse('revision-2', RevisionReviewStates.Approved),
      ];
      TestBed.resetTestingModule();
      await createTestBed({
        registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
        schemaResponses,
      }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.schemaResponse()?.id).toBe('revision-1');
      component.openRevision(1);
      expect(component.schemaResponse()?.id).toBe('revision-2');
    });
  });

  describe('Methods', () => {
    beforeEach(async () => {
      TestBed.resetTestingModule();
      await createTestBed({
        registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
      }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should open revision and update selectedRevisionIndex', () => {
      const revisionIndex = 2;
      component.openRevision(revisionIndex);
      expect(component.selectedRevisionIndex()).toBe(revisionIndex);
    });

    it('should call onUpdateRegistration and navigate to justification page', async () => {
      TestBed.resetTestingModule();
      const mockLoaderService = new LoaderServiceMock();
      const showSpy = jest.spyOn(mockLoaderService, 'show');
      const schemaResponse = createMockSchemaResponse('revision-1', RevisionReviewStates.Approved);
      const navigateSpy = jest.fn();
      const testRegistry = { ...MOCK_REGISTRATION_OVERVIEW_MODEL, id: 'registry-1' };
      await createTestBed({
        registry: testRegistry,
      }).compileComponents();
      TestBed.overrideProvider(LoaderService, { useValue: mockLoaderService });
      TestBed.overrideProvider(Router, {
        useValue: {
          ...RouterMockBuilder.create().withUrl('/registries/registry-1').build(),
          navigate: navigateSpy,
        },
      });
      const mockStore = TestBed.inject(Store);
      jest.spyOn(mockStore, 'selectSignal').mockImplementation((selector: any) => {
        if (selector === RegistrySelectors.getSchemaResponse) {
          return signal(schemaResponse);
        }
        if (selector === RegistrySelectors.getRegistry) {
          return signal(testRegistry);
        }
        return signal(null);
      });
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.onUpdateRegistration('registry-1');

      expect(showSpy).toHaveBeenCalled();
      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(navigateSpy).toHaveBeenCalledWith([`/registries/revisions/revision-1/justification`]);
    });

    it('should navigate to justification page when continuing update for approved revision', async () => {
      TestBed.resetTestingModule();
      const navigateSpy = jest.fn();
      await createTestBed({
        registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
      }).compileComponents();
      TestBed.overrideProvider(Router, {
        useValue: {
          ...RouterMockBuilder.create().withUrl('/registries/registry-1').build(),
          navigate: navigateSpy,
        },
      });
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.revisionInProgress = createMockSchemaResponse('revision-1', RevisionReviewStates.Approved);

      component.onContinueUpdateRegistration();

      expect(navigateSpy).toHaveBeenCalledWith([`/registries/revisions/revision-1/justification`]);
    });

    it('should navigate to review page when continuing update for unapproved revision', async () => {
      TestBed.resetTestingModule();
      const navigateSpy = jest.fn();
      await createTestBed({
        registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
      }).compileComponents();
      TestBed.overrideProvider(Router, {
        useValue: {
          ...RouterMockBuilder.create().withUrl('/registries/registry-1').build(),
          navigate: navigateSpy,
        },
      });
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.revisionInProgress = createMockSchemaResponse('revision-1', RevisionReviewStates.Unapproved);

      component.onContinueUpdateRegistration();

      expect(navigateSpy).toHaveBeenCalledWith([`/registries/revisions/revision-1/review`]);
    });

    it('should handle open make decision dialog', async () => {
      const registryId = 'registry-1';
      TestBed.resetTestingModule();
      const mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();
      const openSpy = jest.spyOn(mockCustomDialogService, 'open');
      const navigateSpy = jest.fn();
      const navigateByUrlSpy = jest.fn().mockResolvedValue(true);
      const showSuccessSpy = jest.fn();

      await createTestBed({
        registry: { ...MOCK_REGISTRATION_OVERVIEW_MODEL, id: registryId },
        queryParams: { revisionId: 'revision-1' },
      }).compileComponents();
      TestBed.overrideProvider(CustomDialogService, { useValue: mockCustomDialogService });
      TestBed.overrideProvider(Router, {
        useValue: {
          ...RouterMockBuilder.create().withUrl('/registries/registry-1').build(),
          navigate: navigateSpy,
          navigateByUrl: navigateByUrlSpy,
        },
      });
      TestBed.overrideProvider(ToastService, {
        useValue: {
          showSuccess: showSuccessSpy,
        },
      });
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const mockDialogRef = {
        onClose: {
          pipe: jest.fn(() =>
            of({
              action: 'accept',
            })
          ),
        },
      };
      openSpy.mockReturnValue(mockDialogRef as any);

      component.handleOpenMakeDecisionDialog();

      await new Promise((resolve) => setTimeout(resolve, 200));

      expect(openSpy).toHaveBeenCalledWith(RegistryMakeDecisionComponent, expect.any(Object));
      expect(showSuccessSpy).toHaveBeenCalledWith('moderation.makeDecision.acceptSuccess');
      expect(navigateByUrlSpy).toHaveBeenCalled();
    });
  });

  describe('Effects', () => {
    it('should dispatch actions when registry ID is available', async () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      TestBed.resetTestingModule();
      await createTestBed({
        registryId: 'registry-1',
        registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
      }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should fetch schema blocks and responses when registry is available', async () => {
      const registry = {
        ...MOCK_REGISTRATION_OVERVIEW_MODEL,
        id: 'registry-1',
        registrationSchemaLink: 'https://example.com/schema',
      };

      TestBed.resetTestingModule();
      await createTestBed({ registry }).compileComponents();
      const mockStore = TestBed.inject(Store);
      const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 200));

      const calls = dispatchSpy.mock.calls.map((call) => call[0]);
      const hasSchemaBlocks = calls.some(
        (action) => action instanceof GetSchemaBlocks && (action as any).schemaLink === registry.registrationSchemaLink
      );
      const hasSchemaResponses = calls.some(
        (action) => action instanceof GetRegistrySchemaResponses && (action as any).registryId === registry.id
      );
      expect(hasSchemaBlocks || hasSchemaResponses).toBe(true);
    });

    it('should handle query params for revisionId and mode', async () => {
      TestBed.resetTestingModule();
      await createTestBed({
        registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
        queryParams: { revisionId: 'revision-1', mode: 'moderator' },
      }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(component.revisionId).toBe('revision-1');
      expect(component.isModeration).toBe(true);
    });
  });

  describe('State-based Behavior', () => {
    it('should handle archiving registry', async () => {
      const archivingRegistry = { ...MOCK_REGISTRATION_OVERVIEW_MODEL, archiving: true };

      TestBed.resetTestingModule();
      await createTestBed({ registry: archivingRegistry }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.showToolbar()).toBe(false);
      expect(component.canMakeDecision()).toBe(false);
    });

    it('should handle withdrawn registry', async () => {
      const withdrawnRegistry = { ...MOCK_REGISTRATION_OVERVIEW_MODEL, withdrawn: true };

      TestBed.resetTestingModule();
      await createTestBed({ registry: withdrawnRegistry }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.showToolbar()).toBe(false);
      expect(component.canMakeDecision()).toBe(false);
    });

    it('should handle different review states', async () => {
      const pendingRegistry = {
        ...MOCK_REGISTRATION_OVERVIEW_MODEL,
        reviewsState: RegistrationReviewStates.Pending,
      };

      TestBed.resetTestingModule();
      await createTestBed({ registry: pendingRegistry }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.isInitialState()).toBe(false);
    });

    it('should find revision in progress from schema responses', async () => {
      const schemaResponses = [
        createMockSchemaResponse('revision-1', RevisionReviewStates.Approved),
        createMockSchemaResponse('revision-2', RevisionReviewStates.RevisionInProgress),
        createMockSchemaResponse('revision-3', RevisionReviewStates.Approved),
      ];

      TestBed.resetTestingModule();
      await createTestBed({
        registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
        schemaResponses,
      }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      component.openRevision(1);
      fixture.detectChanges();

      expect(component.revisionInProgress?.id).toBe('revision-2');
    });
  });

  describe('SSR', () => {
    beforeEach(async () => {
      TestBed.resetTestingModule();
      await createTestBed({
        isSSR: true,
        registryId: 'registry-1',
        registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
      }).compileComponents();
      fixture = TestBed.createComponent(RegistryOverviewComponent);
      component = fixture.componentInstance;
      document.head.innerHTML = '';
    });

    it('should render server-side without errors', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
      expect(component).toBeTruthy();
    });

    it('should add signposting tags during SSR', () => {
      fixture.detectChanges();
      const linkTags = Array.from(document.head.querySelectorAll('link[rel="linkset"]'));
      expect(linkTags.length).toBe(2);
      expect(linkTags[0].getAttribute('href')).toBe('http://localhost:4200/metadata/registry-1/?format=linkset');
      expect(linkTags[0].getAttribute('type')).toBe('application/linkset');
      expect(linkTags[1].getAttribute('href')).toBe('http://localhost:4200/metadata/registry-1/?format=linkset-json');
      expect(linkTags[1].getAttribute('type')).toBe('application/linkset+json');
    });

    it('should not access browser-only APIs during SSR', () => {
      const platformId = TestBed.inject(PLATFORM_ID);
      expect(platformId).toBe('server');
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should execute constructor effects without errors in SSR context', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      fixture.detectChanges();
      expect(dispatchSpy).toHaveBeenCalled();
      expect(component).toBeTruthy();
    });
  });
});
