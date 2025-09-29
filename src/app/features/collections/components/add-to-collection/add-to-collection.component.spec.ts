import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { CollectionMetadataStepComponent } from '@osf/features/collections/components/add-to-collection/collection-metadata-step/collection-metadata-step.component';
import { ProjectContributorsStepComponent } from '@osf/features/collections/components/add-to-collection/project-contributors-step/project-contributors-step.component';
import { ProjectMetadataStepComponent } from '@osf/features/collections/components/add-to-collection/project-metadata-step/project-metadata-step.component';
import { SelectProjectStepComponent } from '@osf/features/collections/components/add-to-collection/select-project-step/select-project-step.component';
import { AddToCollectionSteps } from '@osf/features/collections/enums';
import { LoadingSpinnerComponent } from '@shared/components';
import { MOCK_PROVIDER, MOCK_USER } from '@shared/mocks';
import { CustomDialogService } from '@shared/services';
import { CollectionsSelectors } from '@shared/stores';
import { ProjectsSelectors } from '@shared/stores/projects/projects.selectors';

import { AddToCollectionComponent } from './add-to-collection.component';

import { MOCK_PROJECT } from '@testing/mocks/project.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AddToCollectionComponent', () => {
  let component: AddToCollectionComponent;
  let fixture: ComponentFixture<AddToCollectionComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  const mockCollectionProvider = MOCK_PROVIDER;

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: '1' }).build();
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        AddToCollectionComponent,
        OSFTestingModule,
        ...MockComponents(
          LoadingSpinnerComponent,
          SelectProjectStepComponent,
          ProjectMetadataStepComponent,
          ProjectContributorsStepComponent,
          CollectionMetadataStepComponent
        ),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(CustomDialogService, mockCustomDialogService),
        provideMockStore({
          signals: [
            { selector: CollectionsSelectors.getCollectionProviderLoading, value: false },
            { selector: CollectionsSelectors.getCollectionProvider, value: mockCollectionProvider },
            { selector: ProjectsSelectors.getSelectedProject, value: MOCK_PROJECT },
            { selector: UserSelectors.getCurrentUser, value: MOCK_USER },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddToCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.stepperActiveValue()).toBe(AddToCollectionSteps.SelectProject);
    expect(component.projectMetadataSaved()).toBe(false);
    expect(component.projectContributorsSaved()).toBe(false);
    expect(component.collectionMetadataSaved()).toBe(false);
    expect(component.allowNavigation()).toBe(false);
  });

  it('should handle project selection', () => {
    component.handleProjectSelected();

    expect(component.projectContributorsSaved()).toBe(false);
    expect(component.projectMetadataSaved()).toBe(false);
    expect(component.allowNavigation()).toBe(false);
  });

  it('should handle step change', () => {
    const newStep = AddToCollectionSteps.ProjectMetadata;
    component.handleChangeStep(newStep);

    expect(component.stepperActiveValue()).toBe(newStep);
  });

  it('should handle project metadata saved', () => {
    component.handleProjectMetadataSaved();

    expect(component.projectMetadataSaved()).toBe(true);
  });

  it('should handle contributors saved', () => {
    component.handleContributorsSaved();

    expect(component.stepperActiveValue()).toBe(AddToCollectionSteps.CollectionMetadata);
    expect(component.projectContributorsSaved()).toBe(true);
  });

  it('should handle collection metadata saved', () => {
    const mockForm = new FormGroup({});
    component.handleCollectionMetadataSaved(mockForm);

    expect(component.collectionMetadataForm).toBe(mockForm);
    expect(component.collectionMetadataSaved()).toBe(true);
    expect(component.stepperActiveValue()).toBe(AddToCollectionSteps.Complete);
  });

  it('should have actions defined', () => {
    expect(component.actions).toBeDefined();
    expect(component.actions.getCollectionProvider).toBeDefined();
    expect(component.actions.clearAddToCollectionState).toBeDefined();
    expect(component.actions.createCollectionSubmission).toBeDefined();
  });

  it('should handle loading state', () => {
    expect(component.isProviderLoading()).toBe(false);
  });

  it('should have collection provider data', () => {
    expect(component.collectionProvider()).toEqual(mockCollectionProvider);
  });

  it('should have selected project data', () => {
    expect(component.selectedProject()).toEqual(MOCK_PROJECT);
  });

  it('should have current user data', () => {
    expect(component.currentUser()).toEqual(MOCK_USER);
  });
});
