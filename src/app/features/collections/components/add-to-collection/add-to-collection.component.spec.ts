import { MockComponents, MockProvider } from 'ng-mocks';

import { of, Subject, throwError } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { CollectionMetadataStepComponent } from '@osf/features/collections/components/add-to-collection/collection-metadata-step/collection-metadata-step.component';
import { ProjectContributorsStepComponent } from '@osf/features/collections/components/add-to-collection/project-contributors-step/project-contributors-step.component';
import { ProjectMetadataStepComponent } from '@osf/features/collections/components/add-to-collection/project-metadata-step/project-metadata-step.component';
import { SelectProjectStepComponent } from '@osf/features/collections/components/add-to-collection/select-project-step/select-project-step.component';
import { AddToCollectionSteps } from '@osf/features/collections/enums';
import { CedarRecordDataBinding } from '@osf/features/metadata/models';
import { MetadataSelectors } from '@osf/features/metadata/store';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { BrandService } from '@osf/shared/services/brand.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { HeaderStyleService } from '@osf/shared/services/header-style.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { CollectionsSelectors } from '@shared/stores/collections';
import { ProjectsSelectors } from '@shared/stores/projects/projects.selectors';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { MOCK_PROJECT } from '@testing/mocks/project.mock';
import { MOCK_PROVIDER } from '@testing/mocks/provider.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { BrandServiceMock } from '@testing/providers/brand-service.mock';
import {
  CustomDialogServiceMockBuilder,
  CustomDialogServiceMockType,
} from '@testing/providers/custom-dialog-provider.mock';
import { HeaderStyleServiceMock } from '@testing/providers/header-style-service.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

import { AddToCollectionSelectors } from '../../store/add-to-collection';

import { AddToCollectionComponent } from './add-to-collection.component';

const mockCollectionProvider = MOCK_PROVIDER;

const DEFAULT_SIGNALS: SignalOverride[] = [
  { selector: CollectionsSelectors.getCollectionProviderLoading, value: false },
  { selector: CollectionsSelectors.getCollectionProvider, value: mockCollectionProvider },
  { selector: CollectionsSelectors.getRequiredMetadataTemplate, value: null },
  { selector: ProjectsSelectors.getSelectedProject, value: MOCK_PROJECT },
  { selector: UserSelectors.getCurrentUser, value: MOCK_USER },
  { selector: MetadataSelectors.getCedarRecords, value: [] },
  { selector: AddToCollectionSelectors.getCurrentCollectionSubmission, value: null },
];

interface SetupOptions {
  routeParams?: Record<string, string | null>;
  selectorOverrides?: SignalOverride[];
}

function setup(options: SetupOptions = {}) {
  const { routeParams = { id: null }, selectorOverrides } = options;

  const mockRouter = RouterMockBuilder.create().build();
  const mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams(routeParams).build();
  const mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
  const mockToastService = ToastServiceMock.simple();
  const mockLoaderService = new LoaderServiceMock();
  const mockBrandService = BrandServiceMock.simple();
  const mockHeaderStyleService = HeaderStyleServiceMock.simple();

  TestBed.configureTestingModule({
    imports: [
      AddToCollectionComponent,
      ...MockComponents(
        LoadingSpinnerComponent,
        SelectProjectStepComponent,
        ProjectMetadataStepComponent,
        ProjectContributorsStepComponent,
        CollectionMetadataStepComponent
      ),
    ],
    providers: [
      provideOSFCore(),
      MockProvider(ActivatedRoute, mockActivatedRoute),
      MockProvider(Router, mockRouter),
      MockProvider(CustomDialogService, mockCustomDialogService),
      MockProvider(ToastService, mockToastService),
      MockProvider(LoaderService, mockLoaderService),
      MockProvider(BrandService, mockBrandService),
      MockProvider(HeaderStyleService, mockHeaderStyleService),
      provideMockStore({
        signals: mergeSignalOverrides(DEFAULT_SIGNALS, selectorOverrides),
      }),
    ],
  });

  const fixture: ComponentFixture<AddToCollectionComponent> = TestBed.createComponent(AddToCollectionComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  const dialogService = TestBed.inject(CustomDialogService) as unknown as CustomDialogServiceMockType;

  return {
    component,
    fixture,
    mockRouter,
    mockActivatedRoute,
    mockCustomDialogService,
    dialogService,
    mockToastService,
    mockLoaderService,
    mockBrandService,
    mockHeaderStyleService,
  };
}

describe('AddToCollectionComponent', () => {
  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  it('should initialize with default signal values', () => {
    const { component } = setup();
    expect(component.stepperActiveValue()).toBe(AddToCollectionSteps.SelectProject);
    expect(component.projectMetadataSaved()).toBe(false);
    expect(component.projectContributorsSaved()).toBe(false);
    expect(component.collectionMetadataSaved()).toBe(false);
    expect(component.allowNavigation()).toBe(false);
  });

  it('should navigate to /not-found when providerId is absent from route', () => {
    const { mockRouter } = setup({ routeParams: {} });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/not-found']);
  });

  it('should set providerId and dispatch getCollectionProvider when providerId is present', () => {
    const { component } = setup({ routeParams: { providerId: 'provider-1' } });
    expect(component.providerId()).toBe('provider-1');
  });

  it('should handle project selection', () => {
    const { component } = setup();
    component.handleProjectSelected();

    expect(component.projectContributorsSaved()).toBe(false);
    expect(component.projectMetadataSaved()).toBe(false);
    expect(component.allowNavigation()).toBe(false);
  });

  it('should handle step change', () => {
    const { component } = setup();
    const newStep = AddToCollectionSteps.ProjectMetadata;
    component.handleChangeStep(newStep);

    expect(component.stepperActiveValue()).toBe(newStep);
  });

  it('should handle project metadata saved', () => {
    const { component } = setup();
    component.handleProjectMetadataSaved();

    expect(component.projectMetadataSaved()).toBe(true);
  });

  it('should handle contributors saved', () => {
    const { component } = setup();
    component.handleContributorsSaved();

    expect(component.stepperActiveValue()).toBe(AddToCollectionSteps.CollectionMetadata);
    expect(component.projectContributorsSaved()).toBe(true);
  });

  it('should handle cedar data saved', () => {
    const { component } = setup();
    const mockCedarData: CedarRecordDataBinding = {
      data: {} as CedarRecordDataBinding['data'],
      id: 'template-123',
      isPublished: false,
    };
    component.handleCedarDataSaved(mockCedarData);

    expect(component.pendingCedarData()).toEqual(mockCedarData);
    expect(component.collectionMetadataSaved()).toBe(true);
    expect(component.stepperActiveValue()).toBe(AddToCollectionSteps.Complete);
  });

  it('should have actions defined', () => {
    const { component } = setup();
    expect(component.actions).toBeDefined();
    expect(component.actions.getCollectionProvider).toBeDefined();
    expect(component.actions.clearAddToCollectionState).toBeDefined();
  });

  it('should reflect loading state from store', () => {
    const { component } = setup();
    expect(component.isProviderLoading()).toBe(false);
  });

  it('should expose collection provider from store', () => {
    const { component } = setup();
    expect(component.collectionProvider()).toEqual(mockCollectionProvider);
  });

  it('should expose selected project from store', () => {
    const { component } = setup();
    expect(component.selectedProject()).toEqual(MOCK_PROJECT);
  });

  it('should expose current user from store', () => {
    const { component } = setup();
    expect(component.currentUser()).toEqual(MOCK_USER);
  });

  it('should return true from canDeactivate when allowNavigation is true', () => {
    const { component } = setup();
    component.allowNavigation.set(true);

    expect(component.canDeactivate()).toBe(true);
  });

  it('should return false from canDeactivate when there are unsaved changes', () => {
    const { component } = setup();
    component.projectMetadataSaved.set(true);

    expect(component.canDeactivate()).toBe(false);
  });

  it('should return true from canDeactivate when no unsaved changes', () => {
    const { component } = setup({
      selectorOverrides: [{ selector: ProjectsSelectors.getSelectedProject, value: null }],
    });

    expect(component.canDeactivate()).toBe(true);
  });

  it('should prevent page unload when there are unsaved changes', () => {
    const { component } = setup();
    component.projectMetadataSaved.set(true);
    const mockEvent = { preventDefault: vi.fn() } as unknown as BeforeUnloadEvent;

    const result = component.onBeforeUnload(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should allow page unload when allowNavigation is true', () => {
    const { component } = setup();
    component.allowNavigation.set(true);
    const mockEvent = { preventDefault: vi.fn() } as unknown as BeforeUnloadEvent;

    const result = component.onBeforeUnload(mockEvent);

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should open confirmation dialog in new submission mode with existingCedarRecord in data', () => {
    const { component, dialogService } = setup();
    component.handleAddToCollection();

    expect(dialogService.open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        header: 'collections.addToCollection.confirmationDialogHeader',
        data: expect.objectContaining({ existingCedarRecord: null }),
      })
    );
  });

  it('should navigate on success in edit mode', () => {
    const { component, mockToastService, mockLoaderService, mockRouter } = setup({
      routeParams: { id: 'project-1', providerId: 'provider-1' },
    });

    component.handleAddToCollection();

    expect(mockLoaderService.show).toHaveBeenCalled();
    expect(mockToastService.showSuccess).toHaveBeenCalledWith(
      'collections.addToCollection.confirmationDialogToastMessage'
    );
    expect(component.allowNavigation()).toBe(true);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['project-1', 'overview']);
  });

  it('should show error toast when saving cedar record fails in edit mode', () => {
    const { component, mockToastService } = setup({
      routeParams: { id: 'project-1', providerId: 'provider-1' },
      selectorOverrides: [
        { selector: CollectionsSelectors.getRequiredMetadataTemplate, value: { id: 'template-123' } },
      ],
    });
    const mockCedarData: CedarRecordDataBinding = {
      data: {} as CedarRecordDataBinding['data'],
      id: 'template-123',
      isPublished: false,
    };
    component.handleCedarDataSaved(mockCedarData);
    vi.spyOn(component.actions, 'createCedarRecord').mockReturnValue(throwError(() => new Error('fail')));

    component.handleAddToCollection();

    expect(mockToastService.showError).toHaveBeenCalledWith('collections.addToCollection.updateError');
  });

  it('should not open remove dialog when selected project is missing', () => {
    const { component, dialogService } = setup({
      selectorOverrides: [{ selector: ProjectsSelectors.getSelectedProject, value: null }],
    });
    component.handleRemoveFromCollection();

    expect(dialogService.open).not.toHaveBeenCalled();
  });

  it('should dispatch deleteCollectionSubmission and navigate on successful removal', () => {
    const onCloseSubject = new Subject<{ confirmed: boolean; comment?: string }>();
    const { component, dialogService, mockToastService, mockLoaderService, mockRouter } = setup();

    dialogService.open = vi.fn().mockReturnValue({ onClose: onCloseSubject.asObservable() });
    vi.spyOn(component.actions, 'deleteCollectionSubmission').mockReturnValue(of(void 0));

    component.handleRemoveFromCollection();
    onCloseSubject.next({ confirmed: true, comment: '' });

    expect(mockLoaderService.show).toHaveBeenCalled();
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('collections.removeDialog.success');
    expect(mockLoaderService.hide).toHaveBeenCalled();
    expect(component.allowNavigation()).toBe(true);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['project-1', 'overview']);
  });
});
