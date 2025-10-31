import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ContributorsTableComponent } from '@shared/components/contributors';
import { CustomConfirmationService } from '@shared/services/custom-confirmation.service';
import { ContributorsSelectors } from '@shared/stores/contributors';
import { ProjectsSelectors } from '@shared/stores/projects/projects.selectors';

import { ProjectContributorsStepComponent } from './project-contributors-step.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe.skip('ProjectContributorsStepComponent', () => {
  let component: ProjectContributorsStepComponent;
  let fixture: ComponentFixture<ProjectContributorsStepComponent>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;
  let customConfirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  beforeEach(async () => {
    toastServiceMock = ToastServiceMockBuilder.create().build();
    customConfirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        ProjectContributorsStepComponent,
        OSFTestingModule,
        ...MockComponents(ContributorsTableComponent, InfoIconComponent),
      ],
      providers: [
        MockProvider(ToastService, toastServiceMock),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        MockProvider(CustomDialogService, mockCustomDialogService),
        provideMockStore({
          signals: [
            { selector: ContributorsSelectors.getContributors, value: [] },
            { selector: ContributorsSelectors.isContributorsLoading, value: false },
            { selector: ProjectsSelectors.getSelectedProject, value: null },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectContributorsStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('stepperActiveValue', 0);
    fixture.componentRef.setInput('targetStepValue', 2);
    fixture.componentRef.setInput('isDisabled', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with input values', () => {
    expect(component.stepperActiveValue()).toBe(0);
    expect(component.targetStepValue()).toBe(2);
    expect(component.isDisabled()).toBe(false);
  });

  it('should handle step navigation', () => {
    const navigateSpy = jest.spyOn(component.stepChange, 'emit');

    component.handleEditStep();

    expect(navigateSpy).toHaveBeenCalledWith(component.targetStepValue());
  });

  it('should handle contributor removal', () => {
    const mockContributor = { id: '1', name: 'John Doe' } as any;

    expect(() => component.handleRemoveContributor(mockContributor)).not.toThrow();
  });

  it('should check if contributors changed', () => {
    expect(component.hasContributorsChanged()).toBeDefined();
  });

  it('should have contributors data', () => {
    expect(component.projectContributors()).toBeDefined();
    expect(component.isContributorsLoading()).toBe(false);
  });

  it('should handle different input values', () => {
    fixture.componentRef.setInput('stepperActiveValue', 1);
    fixture.componentRef.setInput('targetStepValue', 3);
    fixture.componentRef.setInput('isDisabled', true);
    fixture.detectChanges();

    expect(component.stepperActiveValue()).toBe(1);
    expect(component.targetStepValue()).toBe(3);
    expect(component.isDisabled()).toBe(true);
  });

  it('should handle form validation', () => {
    expect(component.hasContributorsChanged()).toBeDefined();
  });
});
