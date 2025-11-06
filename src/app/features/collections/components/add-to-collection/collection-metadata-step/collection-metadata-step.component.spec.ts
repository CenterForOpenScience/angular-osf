import { MockComponents } from 'ng-mocks';

import { Step, StepItem, StepPanel } from 'primeng/stepper';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AddToCollectionSteps } from '@osf/features/collections/enums';
import { CollectionsSelectors } from '@shared/stores/collections';

import { CollectionMetadataStepComponent } from './collection-metadata-step.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe.skip('CollectionMetadataStepComponent', () => {
  let component: CollectionMetadataStepComponent;
  let fixture: ComponentFixture<CollectionMetadataStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionMetadataStepComponent, OSFTestingModule, MockComponents(StepPanel, Step, StepItem)],
      providers: [
        provideMockStore({
          signals: [
            { selector: CollectionsSelectors.getCollectionProvider, value: null },
            { selector: CollectionsSelectors.getCollectionProviderLoading, value: false },
            { selector: CollectionsSelectors.getAllFiltersOptions, value: {} },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionMetadataStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('stepperActiveValue', 0);
    fixture.componentRef.setInput('targetStepValue', 1);
    fixture.componentRef.setInput('isDisabled', false);
    fixture.componentRef.setInput('primaryCollectionId', 'test-collection-id');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with input values', () => {
    expect(component.stepperActiveValue()).toBe(0);
    expect(component.targetStepValue()).toBe(1);
    expect(component.isDisabled()).toBe(false);
  });

  it('should handle save metadata', () => {
    const mockForm = new FormGroup({});
    component.collectionMetadataForm.set(mockForm);

    const emitSpy = jest.spyOn(component.metadataSaved, 'emit');
    const stepChangeSpy = jest.spyOn(component.stepChange, 'emit');

    component.handleSaveMetadata();

    expect(emitSpy).toHaveBeenCalledWith(mockForm);
    expect(stepChangeSpy).toHaveBeenCalledWith(AddToCollectionSteps.Complete);
    expect(component.collectionMetadataSaved()).toBe(true);
  });

  it('should handle form validation', () => {
    const validForm = new FormGroup({
      title: new FormControl('Test Collection', [Validators.required]),
    });
    const invalidForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
    });

    expect(validForm.valid).toBe(true);
    expect(invalidForm.valid).toBe(false);
  });

  it('should handle step navigation', () => {
    const navigateSpy = jest.spyOn(component.stepChange, 'emit');

    component.handleEditStep();

    expect(navigateSpy).toHaveBeenCalledWith(component.targetStepValue());
  });

  it('should handle discard changes', () => {
    const mockForm = new FormGroup({});
    component.collectionMetadataForm.set(mockForm);
    component.collectionMetadataSaved.set(true);

    component.handleDiscardChanges();

    expect(component.collectionMetadataSaved()).toBe(false);
  });

  it('should have collection metadata form', () => {
    expect(component.collectionMetadataForm()).toBeDefined();
    expect(component.collectionMetadataSaved()).toBe(false);
  });

  it('should have actions defined', () => {
    expect(component.actions).toBeDefined();
    expect(component.actions.getCollectionDetails).toBeDefined();
  });

  it('should handle different input values', () => {
    fixture.componentRef.setInput('stepperActiveValue', 2);
    fixture.componentRef.setInput('targetStepValue', 3);
    fixture.componentRef.setInput('isDisabled', true);
    fixture.detectChanges();

    expect(component.stepperActiveValue()).toBe(2);
    expect(component.targetStepValue()).toBe(3);
    expect(component.isDisabled()).toBe(true);
  });
});
