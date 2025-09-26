import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SEARCH_TUTORIAL_STEPS } from '@shared/constants';
import { TutorialStep } from '@shared/models';

import { SearchHelpTutorialComponent } from './search-help-tutorial.component';

describe('SearchHelpTutorialComponent', () => {
  let component: SearchHelpTutorialComponent;
  let fixture: ComponentFixture<SearchHelpTutorialComponent>;

  const mockTutorialStep: TutorialStep = {
    title: 'Test Step',
    description: 'This is a test step',
    position: { top: '10px', left: '20px' },
    mobilePosition: { top: '10px', left: '20px' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchHelpTutorialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchHelpTutorialComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have currentStep model with default value 0', () => {
    expect(component.currentStep()).toBe(0);
  });

  it('should set currentStep model correctly', () => {
    fixture.componentRef.setInput('currentStep', 2);
    expect(component.currentStep()).toBe(2);
  });

  it('should have steps signal with SEARCH_TUTORIAL_STEPS', () => {
    expect(component.steps()).toEqual(SEARCH_TUTORIAL_STEPS);
  });

  it('should have access to SEARCH_TUTORIAL_STEPS constant', () => {
    expect(component.steps()).toBe(SEARCH_TUTORIAL_STEPS);
  });

  it('should reset currentStep to 0', () => {
    fixture.componentRef.setInput('currentStep', 2);
    expect(component.currentStep()).toBe(2);

    component.skip();

    expect(component.currentStep()).toBe(0);
  });

  it('should reset currentStep to 0 when already at 0', () => {
    expect(component.currentStep()).toBe(0);

    component.skip();

    expect(component.currentStep()).toBe(0);
  });

  it('should increment currentStep by 1', () => {
    expect(component.currentStep()).toBe(0);

    component.nextStep();

    expect(component.currentStep()).toBe(1);
  });

  it('should increment currentStep multiple times', () => {
    expect(component.currentStep()).toBe(0);

    component.nextStep();
    expect(component.currentStep()).toBe(1);

    component.nextStep();
    expect(component.currentStep()).toBe(2);
  });

  it('should reset to 0 when reaching the end of steps', () => {
    const stepsLength = component.steps().length;
    fixture.componentRef.setInput('currentStep', stepsLength);

    component.nextStep();

    expect(component.currentStep()).toBe(0);
  });

  it('should reset to 0 when exceeding steps length', () => {
    const stepsLength = component.steps().length;
    fixture.componentRef.setInput('currentStep', stepsLength + 1);

    component.nextStep();

    expect(component.currentStep()).toBe(0);
  });

  it('should return position object when step has position', () => {
    const position = component.getStepPosition(mockTutorialStep);
    expect(position).toEqual({ top: '10px', left: '20px' });
  });

  it('should return empty object when step has no position', () => {
    const stepWithoutPosition: TutorialStep = {
      title: 'Test Step',
      description: 'This is a test step',
    };

    const position = component.getStepPosition(stepWithoutPosition);
    expect(position).toEqual({});
  });

  it('should maintain currentStep state across method calls', () => {
    expect(component.currentStep()).toBe(0);

    component.nextStep();
    expect(component.currentStep()).toBe(1);

    component.nextStep();
    expect(component.currentStep()).toBe(2);

    component.skip();
    expect(component.currentStep()).toBe(0);
  });

  it('should handle rapid method calls', () => {
    expect(component.currentStep()).toBe(0);

    component.nextStep();
    component.nextStep();
    component.nextStep();
    expect(component.currentStep()).toBe(3);

    component.nextStep();
    expect(component.currentStep()).toBe(0);
  });
});
