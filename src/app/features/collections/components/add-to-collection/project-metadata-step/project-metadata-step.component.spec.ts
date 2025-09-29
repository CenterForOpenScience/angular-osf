import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { Step, StepItem, StepPanel } from 'primeng/stepper';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCollectionSelectors } from '@osf/features/collections/store/add-to-collection';
import { TagsInputComponent, TextInputComponent, TruncatedTextComponent } from '@shared/components';
import { InterpolatePipe } from '@shared/pipes';
import { ToastService } from '@shared/services';
import { ProjectsSelectors } from '@shared/stores/projects/projects.selectors';

import { ProjectMetadataStepComponent } from './project-metadata-step.component';

import { MOCK_PROJECT } from '@testing/mocks/project.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe.skip('ProjectMetadataStepComponent', () => {
  let component: ProjectMetadataStepComponent;
  let fixture: ComponentFixture<ProjectMetadataStepComponent>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;

  beforeEach(async () => {
    toastServiceMock = ToastServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        ProjectMetadataStepComponent,
        OSFTestingModule,
        ...MockComponents(StepPanel, Step, StepItem, TagsInputComponent, TextInputComponent, TruncatedTextComponent),
        MockPipe(InterpolatePipe),
      ],
      providers: [
        MockProvider(ToastService, toastServiceMock),
        provideMockStore({
          signals: [
            { selector: ProjectsSelectors.getSelectedProject, value: MOCK_PROJECT },
            { selector: AddToCollectionSelectors.getCollectionLicenses, value: [] },
            { selector: ProjectsSelectors.getSelectedProjectUpdateSubmitting, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('stepperActiveValue', 0);
    fixture.componentRef.setInput('targetStepValue', 2);
    fixture.componentRef.setInput('isDisabled', false);
    fixture.componentRef.setInput('providerId', 'id1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with input values', () => {
    expect(component.stepperActiveValue()).toBe(0);
    expect(component.targetStepValue()).toBe(2);
    expect(component.isDisabled()).toBe(false);
    expect(component.providerId()).toBe('id1');
  });

  it('should handle tags change', () => {
    const mockTags = ['tag1', 'tag2', 'tag3'];

    component.handleTagsChange(mockTags);

    expect(component.projectTags()).toEqual(mockTags);
  });

  it('should handle discard changes', () => {
    component.handleTagsChange(['tag1', 'tag2']);
    expect(component.projectTags()).toEqual(['tag1', 'tag2']);

    component.handleDiscardChanges();

    expect(component).toBeTruthy();
  });

  it('should handle edit step', () => {
    const stepChangeSpy = jest.spyOn(component.stepChange, 'emit');

    component.handleEditStep();

    expect(stepChangeSpy).toHaveBeenCalledWith(component.targetStepValue());
  });

  it('should handle different input values', () => {
    fixture.componentRef.setInput('stepperActiveValue', 1);
    fixture.componentRef.setInput('targetStepValue', 3);
    fixture.componentRef.setInput('isDisabled', true);
    fixture.componentRef.setInput('providerId', 'id2');
    fixture.detectChanges();

    expect(component.stepperActiveValue()).toBe(1);
    expect(component.targetStepValue()).toBe(3);
    expect(component.isDisabled()).toBe(true);
    expect(component.providerId()).toBe('id2');
  });

  it('should initialize selected license as null', () => {
    expect(component.selectedLicense()).toBe(null);
  });

  it('should have project metadata form', () => {
    expect(component.projectMetadataForm).toBeDefined();
  });

  it('should have computed project license', () => {
    expect(component.projectLicense()).toBeDefined();
  });
});
