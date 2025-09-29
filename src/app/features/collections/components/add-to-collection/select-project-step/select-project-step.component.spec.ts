import { MockComponents, MockProvider } from 'ng-mocks';

import { Step, StepItem, StepPanel, Stepper } from 'primeng/stepper';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSelectorComponent } from '@shared/components';
import { ToastService } from '@shared/services';
import { CollectionsSelectors } from '@shared/stores';
import { ProjectsSelectors } from '@shared/stores/projects/projects.selectors';

import { SelectProjectStepComponent } from './select-project-step.component';

import { MOCK_PROJECT } from '@testing/mocks/project.mock';
import { MOCK_COLLECTION_SUBMISSION_WITH_GUID } from '@testing/mocks/submission.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe.skip('SelectProjectStepComponent', () => {
  let component: SelectProjectStepComponent;
  let fixture: ComponentFixture<SelectProjectStepComponent>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;

  const mockCollectionSubmissions = [MOCK_COLLECTION_SUBMISSION_WITH_GUID];

  beforeEach(async () => {
    toastServiceMock = ToastServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        SelectProjectStepComponent,
        OSFTestingModule,
        ...MockComponents(Step, StepItem, StepPanel, Stepper, ProjectSelectorComponent),
      ],
      providers: [
        MockProvider(ToastService, toastServiceMock),
        provideMockStore({
          signals: [
            { selector: ProjectsSelectors.getSelectedProject, value: MOCK_PROJECT },
            { selector: CollectionsSelectors.getUserCollectionSubmissions, value: mockCollectionSubmissions },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectProjectStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('stepperActiveValue', 0);
    fixture.componentRef.setInput('targetStepValue', 2);
    fixture.componentRef.setInput('collectionId', 'id1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with input values', () => {
    expect(component.stepperActiveValue()).toBe(0);
    expect(component.targetStepValue()).toBe(2);
    expect(component.collectionId()).toBe('id1');
  });

  it('should handle project change', () => {
    const projectSelectedSpy = jest.spyOn(component.projectSelected, 'emit');
    const stepChangeSpy = jest.spyOn(component.stepChange, 'emit');

    component.handleProjectChange(MOCK_PROJECT);

    expect(component.currentSelectedProject()).toBe(MOCK_PROJECT);
    expect(projectSelectedSpy).toHaveBeenCalled();
    expect(stepChangeSpy).toHaveBeenCalled();
  });

  it('should handle project change with null project', () => {
    const projectSelectedSpy = jest.spyOn(component.projectSelected, 'emit');
    const stepChangeSpy = jest.spyOn(component.stepChange, 'emit');

    component.handleProjectChange(null);

    expect(component.currentSelectedProject()).toBe(null);
    expect(projectSelectedSpy).not.toHaveBeenCalled();
    expect(stepChangeSpy).not.toHaveBeenCalled();
  });

  it('should handle edit step', () => {
    const stepChangeSpy = jest.spyOn(component.stepChange, 'emit');

    component.handleEditStep();

    expect(stepChangeSpy).toHaveBeenCalledWith(component.targetStepValue());
  });

  it('should compute excluded project ids from submissions', () => {
    expect(component.excludedProjectIds()).toEqual([MOCK_COLLECTION_SUBMISSION_WITH_GUID.nodeId]);
  });

  it('should handle different input values', () => {
    fixture.componentRef.setInput('stepperActiveValue', 1);
    fixture.componentRef.setInput('targetStepValue', 3);
    fixture.componentRef.setInput('collectionId', 'id2');
    fixture.detectChanges();

    expect(component.stepperActiveValue()).toBe(1);
    expect(component.targetStepValue()).toBe(3);
    expect(component.collectionId()).toBe('id2');
  });

  it('should initialize current selected project as null', () => {
    expect(component.currentSelectedProject()).toBe(null);
  });

  it('should set current selected project when project changes', () => {
    component.handleProjectChange(MOCK_PROJECT);

    expect(component.currentSelectedProject()).toBe(MOCK_PROJECT);
  });
});
