import { MockComponents } from 'ng-mocks';

import { Step, StepItem, StepPanel } from 'primeng/stepper';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  CedarEditorElement,
  CedarMetadataRecordModel,
  CedarMetadataTemplateModel,
} from '@osf/features/metadata/models';

import { MOCK_CEDAR_RECORD } from '@testing/data/collections/cedar-metadata.mock';
import { MOCK_CEDAR_METADATA_TEMPLATE } from '@testing/mocks/cedar-metadata-domain.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { CollectionMetadataStepComponent } from './collection-metadata-step.component';

describe('CollectionMetadataStepComponent', () => {
  let component: CollectionMetadataStepComponent;
  let fixture: ComponentFixture<CollectionMetadataStepComponent>;

  const mockCedarTemplate = MOCK_CEDAR_METADATA_TEMPLATE;

  function setup(
    options: {
      cedarTemplate?: CedarMetadataTemplateModel | null;
      existingCedarRecord?: CedarMetadataRecordModel | null;
      stepperActiveValue?: number;
      targetStepValue?: number;
      isDisabled?: boolean;
      editor?: CedarEditorElement;
    } = {}
  ) {
    TestBed.configureTestingModule({
      imports: [CollectionMetadataStepComponent, MockComponents(StepPanel, Step, StepItem)],
      providers: [provideOSFCore(), provideMockStore({ signals: [] })],
    });

    fixture = TestBed.createComponent(CollectionMetadataStepComponent);
    component = fixture.componentInstance;

    if (options.editor) {
      vi.spyOn(component, 'cedarEditor').mockReturnValue({ nativeElement: options.editor } as never);
    }

    fixture.componentRef.setInput('stepperActiveValue', options.stepperActiveValue ?? 0);
    fixture.componentRef.setInput('targetStepValue', options.targetStepValue ?? 1);
    fixture.componentRef.setInput('isDisabled', options.isDisabled ?? false);
    if (options.cedarTemplate !== undefined) {
      fixture.componentRef.setInput('cedarTemplate', options.cedarTemplate);
    }
    if (options.existingCedarRecord !== undefined) {
      fixture.componentRef.setInput('existingCedarRecord', options.existingCedarRecord);
    }

    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should initialize with input values', () => {
    setup();

    expect(component.stepperActiveValue()).toBe(0);
    expect(component.targetStepValue()).toBe(1);
    expect(component.isDisabled()).toBe(false);
    expect(component.isStepActive()).toBe(false);
  });

  it('should handle step navigation', () => {
    setup();

    const navigateSpy = vi.spyOn(component.stepChange, 'emit');

    component.handleEditStep();

    expect(navigateSpy).toHaveBeenCalledWith(component.targetStepValue());
  });

  it('should reflect step active state from stepper inputs', () => {
    setup();

    fixture.componentRef.setInput('stepperActiveValue', 3);
    fixture.componentRef.setInput('targetStepValue', 3);
    fixture.componentRef.setInput('isDisabled', true);
    fixture.detectChanges();

    expect(component.stepperActiveValue()).toBe(3);
    expect(component.targetStepValue()).toBe(3);
    expect(component.isDisabled()).toBe(true);
    expect(component.isStepActive()).toBe(true);
  });

  it('should accept cedar template', () => {
    setup({ cedarTemplate: mockCedarTemplate });

    expect(component.cedarTemplate()).toEqual(mockCedarTemplate);
  });

  it('should handle discard changes without existing record', () => {
    setup({ cedarTemplate: mockCedarTemplate });

    component.cedarFormData.set({ field: 'value' });
    component.collectionMetadataSaved.set(true);

    component.handleDiscardChanges();

    expect(component.collectionMetadataSaved()).toBe(false);
    expect(component.cedarFormData()).toEqual({});
  });

  it('should discard cedar changes to existing record metadata', () => {
    setup({
      cedarTemplate: mockCedarTemplate,
      existingCedarRecord: MOCK_CEDAR_RECORD,
    });

    component.cedarFormData.set({ field: 'edited' });
    component.collectionMetadataSaved.set(true);

    component.handleDiscardChanges();

    expect(component.collectionMetadataSaved()).toBe(false);
    expect(component.cedarFormData()).toEqual({ field: 'value' });
  });

  it('should load template and existing record metadata together when step opens', () => {
    const editor = {} as CedarEditorElement;
    setup({
      cedarTemplate: mockCedarTemplate,
      existingCedarRecord: MOCK_CEDAR_RECORD,
      stepperActiveValue: 1,
      editor,
    });

    expect(editor.templateAndInstanceObject).toEqual({
      templateObject: mockCedarTemplate.template,
      instanceObject: { field: 'value' },
    });
    expect(editor.instanceObject).toBeUndefined();
  });

  it('should load saved metadata together with template when step is reopened', () => {
    const editor = {} as CedarEditorElement;
    setup({ cedarTemplate: mockCedarTemplate, editor });

    component.cedarFormData.set({ field: 'saved' });
    component.collectionMetadataSaved.set(true);
    fixture.componentRef.setInput('stepperActiveValue', 1);
    fixture.detectChanges();

    expect(editor.templateAndInstanceObject).toEqual({
      templateObject: mockCedarTemplate.template,
      instanceObject: { field: 'saved' },
    });
  });

  it('should load existing record metadata together with template on discard', () => {
    const editor = {} as CedarEditorElement;
    setup({ cedarTemplate: mockCedarTemplate, existingCedarRecord: MOCK_CEDAR_RECORD, editor });

    component.cedarFormData.set({ field: 'edited' });
    component.handleDiscardChanges();

    expect(editor.templateAndInstanceObject).toEqual({
      templateObject: mockCedarTemplate.template,
      instanceObject: { field: 'value' },
    });
  });

  it('should populate cedarFormData from existingCedarRecord', () => {
    setup({
      cedarTemplate: mockCedarTemplate,
      existingCedarRecord: MOCK_CEDAR_RECORD,
    });

    expect(component.cedarFormData()).toEqual({ field: 'value' });
  });

  it('should not overwrite cedarFormData from API when metadata is already saved locally', () => {
    setup({
      cedarTemplate: mockCedarTemplate,
      existingCedarRecord: MOCK_CEDAR_RECORD,
    });

    component.collectionMetadataSaved.set(true);
    component.cedarFormData.set({ field: 'local' });

    fixture.componentRef.setInput('existingCedarRecord', {
      ...MOCK_CEDAR_RECORD,
      metadata: { field: 'api' } as unknown as CedarMetadataRecordModel['metadata'],
    });
    fixture.detectChanges();

    expect(component.cedarFormData()).toEqual({ field: 'local' });
  });

  it('should not emit cedarDataSaved when handleSaveCedarMetadata is called without editor', () => {
    setup({ cedarTemplate: mockCedarTemplate });

    const cedarDataSavedSpy = vi.spyOn(component.cedarDataSaved, 'emit');
    const stepChangeSpy = vi.spyOn(component.stepChange, 'emit');

    component.handleSaveCedarMetadata();

    expect(cedarDataSavedSpy).not.toHaveBeenCalled();
    expect(stepChangeSpy).not.toHaveBeenCalled();
  });

  it('should handle onCedarChange event', () => {
    setup({ cedarTemplate: mockCedarTemplate });

    const mockMetadata = { field: 'changed' };
    const mockEditor = { currentMetadata: mockMetadata };
    const mockEvent = new CustomEvent('change');

    Object.defineProperty(mockEvent, 'target', { value: mockEditor, writable: true });

    component.onCedarChange(mockEvent);

    expect(component.cedarFormData()).toEqual(mockMetadata);
  });

  it('should not update cedarFormData when onCedarChange has no currentMetadata', () => {
    setup({ cedarTemplate: mockCedarTemplate });

    const mockEvent = new CustomEvent('change', {});
    const mockEditor = {};

    Object.defineProperty(mockEvent, 'target', { value: mockEditor, writable: true });

    const initialFormData = component.cedarFormData();

    component.onCedarChange(mockEvent);

    expect(component.cedarFormData()).toEqual(initialFormData);
  });

  it('should not emit cedarDataSaved without template', () => {
    setup({ cedarTemplate: mockCedarTemplate });

    fixture.componentRef.setInput('cedarTemplate', null);
    fixture.detectChanges();

    const cedarDataSavedSpy = vi.spyOn(component.cedarDataSaved, 'emit');

    component.handleSaveCedarMetadata();

    expect(cedarDataSavedSpy).not.toHaveBeenCalled();
  });
});
