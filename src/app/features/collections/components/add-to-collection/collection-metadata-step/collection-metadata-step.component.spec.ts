import { MockComponents } from 'ng-mocks';

import { Step, StepItem, StepPanel } from 'primeng/stepper';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AddToCollectionSteps } from '@osf/features/collections/enums';
import { AddToCollectionSelectors } from '@osf/features/collections/store/add-to-collection';
import { CedarMetadataDataTemplateJsonApi, CedarMetadataRecordData } from '@osf/features/metadata/models';
import { CollectionsSelectors } from '@shared/stores/collections';

import { MOCK_CEDAR_TEMPLATE } from '@testing/data/collections/cedar-metadata.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { CollectionMetadataStepComponent } from './collection-metadata-step.component';

describe('CollectionMetadataStepComponent', () => {
  let component: CollectionMetadataStepComponent;
  let fixture: ComponentFixture<CollectionMetadataStepComponent>;

  function setup(isCedarMode = false, cedarTemplate: CedarMetadataDataTemplateJsonApi | null = null) {
    TestBed.configureTestingModule({
      imports: [CollectionMetadataStepComponent, MockComponents(StepPanel, Step, StepItem)],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [
            { selector: CollectionsSelectors.getCollectionProvider, value: null },
            { selector: CollectionsSelectors.getCollectionProviderLoading, value: false },
            { selector: CollectionsSelectors.getAllFiltersOptions, value: {} },
            { selector: AddToCollectionSelectors.getCurrentCollectionSubmission, value: null },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(CollectionMetadataStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('stepperActiveValue', 0);
    fixture.componentRef.setInput('targetStepValue', 1);
    fixture.componentRef.setInput('isDisabled', false);
    fixture.componentRef.setInput('primaryCollectionId', 'test-collection-id');
    fixture.componentRef.setInput('isCedarMode', isCedarMode);
    if (cedarTemplate) {
      fixture.componentRef.setInput('cedarTemplate', cedarTemplate);
    }

    fixture.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with input values', () => {
    expect(component.stepperActiveValue()).toBe(0);
    expect(component.targetStepValue()).toBe(1);
    expect(component.isDisabled()).toBe(false);
    expect(component.isCedarMode()).toBe(false);
  });

  it('should handle save metadata in filter mode', () => {
    const mockForm = new FormGroup({});
    component.collectionMetadataForm.set(mockForm);

    const emitSpy = vi.spyOn(component.metadataSaved, 'emit');
    const stepChangeSpy = vi.spyOn(component.stepChange, 'emit');

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
    const navigateSpy = vi.spyOn(component.stepChange, 'emit');

    component.handleEditStep();

    expect(navigateSpy).toHaveBeenCalledWith(component.targetStepValue());
  });

  it('should handle discard changes in filter mode', () => {
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

  it('should handle different input values', () => {
    fixture.componentRef.setInput('stepperActiveValue', 2);
    fixture.componentRef.setInput('targetStepValue', 3);
    fixture.componentRef.setInput('isDisabled', true);
    fixture.detectChanges();

    expect(component.stepperActiveValue()).toBe(2);
    expect(component.targetStepValue()).toBe(3);
    expect(component.isDisabled()).toBe(true);
  });

  describe('CEDAR mode', () => {
    beforeEach(() => {
      setup(true, MOCK_CEDAR_TEMPLATE);
    });

    it('should initialize in CEDAR mode', () => {
      expect(component.isCedarMode()).toBe(true);
      expect(component.cedarTemplate()).toEqual(MOCK_CEDAR_TEMPLATE);
    });

    it('should handle discard changes in CEDAR mode', () => {
      component.cedarFormData.set({ field: 'value' });
      component.collectionMetadataSaved.set(true);

      component.handleDiscardChanges();

      expect(component.collectionMetadataSaved()).toBe(false);
      expect(component.cedarFormData()).toEqual({});
    });

    it('should handle discard changes with existing record in CEDAR mode', () => {
      const existingRecord: CedarMetadataRecordData = {
        attributes: {
          metadata: { field: 'original' } as unknown as CedarMetadataRecordData['attributes']['metadata'],
          is_published: false,
        },
        relationships: {
          template: { data: { type: 'cedar-metadata-templates', id: 'template-1' } },
          target: { data: { type: 'nodes', id: 'node-1' } },
        },
      };
      fixture.componentRef.setInput('existingCedarRecord', existingRecord);
      fixture.detectChanges();

      component.collectionMetadataSaved.set(true);
      component.handleDiscardChanges();

      expect(component.collectionMetadataSaved()).toBe(false);
    });

    it('should populate cedarFormData from existingCedarRecord', () => {
      const existingRecord: CedarMetadataRecordData = {
        attributes: {
          metadata: { field: 'existing' } as unknown as CedarMetadataRecordData['attributes']['metadata'],
          is_published: true,
        },
        relationships: {
          template: { data: { type: 'cedar-metadata-templates', id: 'template-1' } },
          target: { data: { type: 'nodes', id: 'node-1' } },
        },
      };
      fixture.componentRef.setInput('existingCedarRecord', existingRecord);
      fixture.detectChanges();

      expect(component.cedarFormData()).toEqual({ field: 'existing' });
    });

    it('should emit cedarDataSaved when handleSaveCedarMetadata is called without editor', () => {
      const cedarDataSavedSpy = vi.spyOn(component.cedarDataSaved, 'emit');
      const stepChangeSpy = vi.spyOn(component.stepChange, 'emit');

      component.handleSaveCedarMetadata();

      expect(cedarDataSavedSpy).not.toHaveBeenCalled();
      expect(stepChangeSpy).not.toHaveBeenCalled();
    });

    it('should handle onCedarChange event', () => {
      const mockMetadata = { field: 'changed' };
      const mockEditor = { currentMetadata: mockMetadata } as unknown as EventTarget;
      const mockEvent = new CustomEvent('change');
      Object.defineProperty(mockEvent, 'target', { value: mockEditor });

      component.onCedarChange(mockEvent);

      expect(component.cedarFormData()).toEqual(mockMetadata);
    });

    it('should not call handleSaveCedarMetadata without template', () => {
      fixture.componentRef.setInput('cedarTemplate', null);
      fixture.detectChanges();

      const cedarDataSavedSpy = vi.spyOn(component.cedarDataSaved, 'emit');

      component.handleSaveCedarMetadata();

      expect(cedarDataSavedSpy).not.toHaveBeenCalled();
    });
  });
});
