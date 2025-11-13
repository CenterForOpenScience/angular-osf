import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOption } from '@shared/models/step-option.model';

import { IconComponent } from '../icon/icon.component';

import { StepperComponent } from './stepper.component';

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;

  const mockSteps: StepOption[] = [
    { index: 0, label: 'Step 1', value: 1 },
    { index: 1, label: 'Step 2', value: 2 },
    { index: 2, label: 'Step 3', value: 3 },
  ];

  const mockCurrentStep: StepOption = { index: 0, label: 'Step 1', value: 1 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperComponent, MockComponent(IconComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set steps input correctly', () => {
    fixture.componentRef.setInput('steps', mockSteps);
    expect(component.steps()).toEqual(mockSteps);
  });

  it('should set currentStep model correctly', () => {
    fixture.componentRef.setInput('currentStep', mockCurrentStep);
    expect(component.currentStep()).toEqual(mockCurrentStep);
  });

  it('should set linear input to false', () => {
    fixture.componentRef.setInput('linear', false);
    expect(component.linear()).toBe(false);
  });

  it('should set linear input to true', () => {
    fixture.componentRef.setInput('linear', true);
    expect(component.linear()).toBe(true);
  });

  it('should return early when linear() is true AND step.index > currentStep().index', () => {
    fixture.componentRef.setInput('currentStep', { index: 1, label: 'Step 2', value: 2 });
    fixture.componentRef.setInput('linear', true);

    const futureStep = { index: 2, label: 'Step 3', value: 3 };
    const originalStep = component.currentStep();

    component.onStepClick(futureStep);

    expect(component.currentStep()).toEqual(originalStep);
  });

  it('should NOT return early when linear() is false AND step.index > currentStep().index', () => {
    fixture.componentRef.setInput('currentStep', { index: 1, label: 'Step 2', value: 2 });
    fixture.componentRef.setInput('linear', false);

    const futureStep = { index: 2, label: 'Step 3', value: 3 };

    component.onStepClick(futureStep);

    expect(component.currentStep()).toEqual(futureStep);
  });

  it('should NOT return early when step.index < currentStep().index', () => {
    fixture.componentRef.setInput('currentStep', { index: 2, label: 'Step 3', value: 3 });
    fixture.componentRef.setInput('linear', true);

    const previousStep = { index: 1, label: 'Step 2', value: 2 };

    component.onStepClick(previousStep);

    expect(component.currentStep()).toEqual(previousStep);
  });

  it('should call currentStep.set(step) when conditions are met', () => {
    fixture.componentRef.setInput('currentStep', { index: 1, label: 'Step 2', value: 2 });
    fixture.componentRef.setInput('linear', false);

    const newStep = { index: 0, label: 'Step 1', value: 1 };

    component.onStepClick(newStep);

    expect(component.currentStep()).toEqual(newStep);
  });

  it('should handle edge case: step.index === 0, currentStep().index === 0', () => {
    fixture.componentRef.setInput('currentStep', { index: 0, label: 'Step 1', value: 1 });
    fixture.componentRef.setInput('linear', true);

    const sameStep = { index: 0, label: 'Step 1', value: 1 };
    const originalStep = component.currentStep();

    component.onStepClick(sameStep);

    expect(component.currentStep()).toEqual(originalStep);
  });

  it('should handle edge case: step.index === 0, currentStep().index === 1', () => {
    fixture.componentRef.setInput('currentStep', { index: 1, label: 'Step 2', value: 2 });
    fixture.componentRef.setInput('linear', true);

    const previousStep = { index: 0, label: 'Step 1', value: 1 };

    component.onStepClick(previousStep);

    expect(component.currentStep()).toEqual(previousStep);
  });

  it('should handle edge case: step.index === 2, currentStep().index === 1', () => {
    fixture.componentRef.setInput('currentStep', { index: 1, label: 'Step 2', value: 2 });
    fixture.componentRef.setInput('linear', true);

    const futureStep = { index: 2, label: 'Step 3', value: 3 };
    const originalStep = component.currentStep();

    component.onStepClick(futureStep);

    expect(component.currentStep()).toEqual(originalStep);
  });

  it('should handle edge case: step.index === 2, currentStep().index === 1', () => {
    fixture.componentRef.setInput('currentStep', { index: 1, label: 'Step 2', value: 2 });
    fixture.componentRef.setInput('linear', false);

    const futureStep = { index: 2, label: 'Step 3', value: 3 };

    component.onStepClick(futureStep);

    expect(component.currentStep()).toEqual(futureStep);
  });

  it('should not change currentStep when clicking same step', () => {
    fixture.componentRef.setInput('steps', mockSteps);
    fixture.componentRef.setInput('currentStep', mockCurrentStep);

    const sameStep = { index: 0, label: 'Step 1', value: 1 };
    component.onStepClick(sameStep);

    expect(component.currentStep()).toEqual(mockCurrentStep);
  });

  it('should change currentStep when clicking different step in non-linear mode', () => {
    fixture.componentRef.setInput('steps', mockSteps);
    fixture.componentRef.setInput('currentStep', mockCurrentStep);
    fixture.componentRef.setInput('linear', false);

    const newStep = { index: 2, label: 'Step 3', value: 3 };
    component.onStepClick(newStep);

    expect(component.currentStep()).toEqual(newStep);
  });

  it('should change currentStep when clicking previous step in linear mode', () => {
    fixture.componentRef.setInput('steps', mockSteps);
    fixture.componentRef.setInput('currentStep', { index: 2, label: 'Step 3', value: 3 });
    fixture.componentRef.setInput('linear', true);

    const previousStep = { index: 1, label: 'Step 2', value: 2 };
    component.onStepClick(previousStep);

    expect(component.currentStep()).toEqual(previousStep);
  });

  it('should not change currentStep when clicking future step in linear mode', () => {
    fixture.componentRef.setInput('steps', mockSteps);
    fixture.componentRef.setInput('currentStep', mockCurrentStep);
    fixture.componentRef.setInput('linear', true);

    const futureStep = { index: 2, label: 'Step 3', value: 3 };
    const originalStep = component.currentStep();
    component.onStepClick(futureStep);

    expect(component.currentStep()).toEqual(originalStep);
  });

  it('should handle steps with additional properties', () => {
    const stepsWithProps: StepOption[] = [
      { index: 0, label: 'Step 1', value: 1, invalid: false, disabled: false },
      { index: 1, label: 'Step 2', value: 2, invalid: true, disabled: true, routeLink: '/step2' },
      { index: 2, label: 'Step 3', value: 3, routeLink: '/step3' },
    ];

    fixture.componentRef.setInput('steps', stepsWithProps);
    expect(component.steps()).toEqual(stepsWithProps);
  });

  it('should handle currentStep with additional properties', () => {
    const currentStepWithProps: StepOption = {
      index: 1,
      label: 'Step 2',
      value: 2,
      invalid: true,
      disabled: false,
      routeLink: '/step2',
    };

    fixture.componentRef.setInput('currentStep', currentStepWithProps);
    expect(component.currentStep()).toEqual(currentStepWithProps);
  });

  it('should handle rapid step changes', () => {
    fixture.componentRef.setInput('steps', mockSteps);
    fixture.componentRef.setInput('currentStep', mockCurrentStep);
    fixture.componentRef.setInput('linear', false);

    component.onStepClick({ index: 1, label: 'Step 2', value: 2 });
    expect(component.currentStep().index).toBe(1);

    component.onStepClick({ index: 2, label: 'Step 3', value: 3 });
    expect(component.currentStep().index).toBe(2);

    component.onStepClick({ index: 0, label: 'Step 1', value: 1 });
    expect(component.currentStep().index).toBe(0);
  });
});
