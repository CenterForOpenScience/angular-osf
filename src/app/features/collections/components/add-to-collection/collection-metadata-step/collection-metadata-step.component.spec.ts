import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { Step, StepItem, StepPanel } from 'primeng/stepper';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { AddToCollectionSteps, CollectionFilterType } from '@osf/features/collections/enums';
import { AddToCollectionSelectors } from '@osf/features/collections/store/add-to-collection';
import { CedarMetadataDataTemplateJsonApi, CedarMetadataRecordDataJsonApi } from '@osf/features/metadata/models';
import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import {
  CollectionProjectSubmission,
  CollectionSubmissionWithGuid,
} from '@osf/shared/models/collections/collection-submissions.model';
import { CollectionsSelectors, GetCollectionDetails } from '@osf/shared/stores/collections';

import {
  MOCK_CEDAR_RECORD,
  MOCK_CEDAR_SUBMISSION,
  MOCK_CEDAR_TEMPLATE,
} from '@testing/data/collections/cedar-metadata.mock';
import { MOCK_COLLECTIONS_FILTERS_OPTIONS } from '@testing/mocks/collections-filters.mock';
import { MOCK_PROJECT } from '@testing/mocks/project.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

import '@testing/mocks/cedar-embeddable-editor.mock';

import { CollectionMetadataStepComponent } from './collection-metadata-step.component';

const MOCK_SUBMISSION_WITH_GUID = {
  ...MOCK_CEDAR_SUBMISSION,
  nodeId: 'node-1',
  nodeUrl: 'https://example.com',
  title: 'Test project',
  description: 'Description',
  category: 'project',
  dateCreated: '2020-01-01',
  dateModified: '2020-01-01',
  public: true,
  reviewsState: CollectionSubmissionReviewState.Pending,
} as CollectionSubmissionWithGuid;

const MOCK_PROJECT_SUBMISSION: CollectionProjectSubmission = {
  submission: MOCK_SUBMISSION_WITH_GUID,
  project: MOCK_PROJECT,
};

describe('CollectionMetadataStepComponent', () => {
  let component: CollectionMetadataStepComponent;
  let fixture: ComponentFixture<CollectionMetadataStepComponent>;
  let store: Store;

  function setup(
    options: {
      isCedarMode?: boolean;
      cedarTemplate?: CedarMetadataDataTemplateJsonApi | null;
      existingCedarRecord?: CedarMetadataRecordDataJsonApi | null;
      stepperActiveValue?: number;
      targetStepValue?: number;
      isDisabled?: boolean;
      primaryCollectionId?: string;
      filterOptions?: typeof MOCK_COLLECTIONS_FILTERS_OPTIONS;
      collectionSubmission?: CollectionProjectSubmission | null;
      selectorOverrides?: SignalOverride[];
    } = {}
  ) {
    const signals = mergeSignalOverrides(
      [
        { selector: CollectionsSelectors.getCollectionProvider, value: null },
        { selector: CollectionsSelectors.getCollectionProviderLoading, value: false },
        { selector: CollectionsSelectors.getAllFiltersOptions, value: options.filterOptions ?? {} },
        {
          selector: AddToCollectionSelectors.getCurrentCollectionSubmission,
          value: options.collectionSubmission ?? null,
        },
      ],
      options.selectorOverrides
    );

    TestBed.configureTestingModule({
      imports: [CollectionMetadataStepComponent, MockComponents(StepPanel, Step, StepItem)],
      providers: [provideOSFCore(), provideMockStore({ signals })],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(CollectionMetadataStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('stepperActiveValue', options.stepperActiveValue ?? 0);
    fixture.componentRef.setInput('targetStepValue', options.targetStepValue ?? 1);
    fixture.componentRef.setInput('isDisabled', options.isDisabled ?? false);
    fixture.componentRef.setInput('primaryCollectionId', options.primaryCollectionId ?? 'test-collection-id');

    if (options.isCedarMode !== undefined) {
      fixture.componentRef.setInput('isCedarMode', options.isCedarMode);
    }
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
    expect(component.isCedarMode()).toBe(false);
    expect(component.isStepActive()).toBe(false);
  });

  it('should dispatch GetCollectionDetails when primaryCollectionId is set', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetCollectionDetails('test-collection-id'));
  });

  it('should handle save metadata in filter mode', () => {
    setup();

    const mockForm = new FormGroup({});
    component.collectionMetadataForm.set(mockForm);

    const emitSpy = vi.spyOn(component.metadataSaved, 'emit');
    const stepChangeSpy = vi.spyOn(component.stepChange, 'emit');

    component.handleSaveMetadata();

    expect(emitSpy).toHaveBeenCalledWith(mockForm);
    expect(stepChangeSpy).toHaveBeenCalledWith(AddToCollectionSteps.Complete);
    expect(component.collectionMetadataSaved()).toBe(true);
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

  it('should build available filter entries from collection filter options', () => {
    setup({ filterOptions: MOCK_COLLECTIONS_FILTERS_OPTIONS });

    const entries = component.availableFilterEntries();

    expect(entries.length).toBeGreaterThan(0);
    expect(entries.some((entry) => entry.key === CollectionFilterType.ProgramArea)).toBe(true);
  });

  it('should populate collection metadata form from submission', () => {
    setup({
      filterOptions: MOCK_COLLECTIONS_FILTERS_OPTIONS,
      collectionSubmission: MOCK_PROJECT_SUBMISSION,
      stepperActiveValue: AddToCollectionSteps.CollectionMetadata,
      targetStepValue: AddToCollectionSteps.CollectionMetadata,
    });

    expect(component.collectionMetadataForm().get(CollectionFilterType.ProgramArea)?.value).toBe('Science');
  });

  it('should restore original filter values on discard', () => {
    setup({
      filterOptions: MOCK_COLLECTIONS_FILTERS_OPTIONS,
      collectionSubmission: MOCK_PROJECT_SUBMISSION,
      stepperActiveValue: AddToCollectionSteps.CollectionMetadata,
      targetStepValue: AddToCollectionSteps.CollectionMetadata,
    });

    const form = component.collectionMetadataForm();
    form.get(CollectionFilterType.ProgramArea)?.setValue('Technology');
    component.collectionMetadataSaved.set(true);

    component.handleDiscardChanges();

    expect(component.collectionMetadataSaved()).toBe(false);
    expect(form.get(CollectionFilterType.ProgramArea)?.value).toBe('Science');
  });

  it('should initialize in CEDAR mode', () => {
    setup({ isCedarMode: true, cedarTemplate: MOCK_CEDAR_TEMPLATE });

    expect(component.isCedarMode()).toBe(true);
    expect(component.cedarTemplate()).toEqual(MOCK_CEDAR_TEMPLATE);
  });

  it('should handle discard changes in CEDAR mode without existing record', () => {
    setup({ isCedarMode: true, cedarTemplate: MOCK_CEDAR_TEMPLATE });

    component.cedarFormData.set({ field: 'value' });
    component.collectionMetadataSaved.set(true);

    component.handleDiscardChanges();

    expect(component.collectionMetadataSaved()).toBe(false);
    expect(component.cedarFormData()).toEqual({});
  });

  it('should discard cedar changes to existing record metadata', () => {
    setup({
      isCedarMode: true,
      cedarTemplate: MOCK_CEDAR_TEMPLATE,
      existingCedarRecord: MOCK_CEDAR_RECORD,
    });

    component.cedarFormData.set({ field: 'edited' });
    component.collectionMetadataSaved.set(true);

    component.handleDiscardChanges();

    expect(component.collectionMetadataSaved()).toBe(false);
    expect(component.cedarFormData()).toEqual({ field: 'value' });
  });

  it('should populate cedarFormData from existingCedarRecord', () => {
    setup({
      isCedarMode: true,
      cedarTemplate: MOCK_CEDAR_TEMPLATE,
      existingCedarRecord: MOCK_CEDAR_RECORD,
    });

    expect(component.cedarFormData()).toEqual({ field: 'value' });
  });

  it('should not overwrite cedarFormData from API when metadata is already saved locally', () => {
    setup({
      isCedarMode: true,
      cedarTemplate: MOCK_CEDAR_TEMPLATE,
      existingCedarRecord: MOCK_CEDAR_RECORD,
    });

    component.collectionMetadataSaved.set(true);
    component.cedarFormData.set({ field: 'local' });

    fixture.componentRef.setInput('existingCedarRecord', {
      ...MOCK_CEDAR_RECORD,
      attributes: {
        ...MOCK_CEDAR_RECORD.attributes,
        metadata: { field: 'api' } as unknown as CedarMetadataRecordDataJsonApi['attributes']['metadata'],
      },
    });
    fixture.detectChanges();

    expect(component.cedarFormData()).toEqual({ field: 'local' });
  });

  it('should not emit cedarDataSaved when handleSaveCedarMetadata is called without editor', () => {
    setup({ isCedarMode: true, cedarTemplate: MOCK_CEDAR_TEMPLATE });

    const cedarDataSavedSpy = vi.spyOn(component.cedarDataSaved, 'emit');
    const stepChangeSpy = vi.spyOn(component.stepChange, 'emit');

    component.handleSaveCedarMetadata();

    expect(cedarDataSavedSpy).not.toHaveBeenCalled();
    expect(stepChangeSpy).not.toHaveBeenCalled();
  });

  it('should handle onCedarChange event', () => {
    setup({ isCedarMode: true, cedarTemplate: MOCK_CEDAR_TEMPLATE });

    const mockMetadata = { field: 'changed' };
    const mockEditor = { currentMetadata: mockMetadata };
    const mockEvent = new CustomEvent('change');

    Object.defineProperty(mockEvent, 'target', { value: mockEditor, writable: true });

    component.onCedarChange(mockEvent);

    expect(component.cedarFormData()).toEqual(mockMetadata);
  });

  it('should not update cedarFormData when onCedarChange has no currentMetadata', () => {
    setup({ isCedarMode: true, cedarTemplate: MOCK_CEDAR_TEMPLATE });

    const mockEvent = new CustomEvent('change', {});
    const mockEditor = {};

    Object.defineProperty(mockEvent, 'target', { value: mockEditor, writable: true });

    const initialFormData = component.cedarFormData();

    component.onCedarChange(mockEvent);

    expect(component.cedarFormData()).toEqual(initialFormData);
  });

  it('should not emit cedarDataSaved without template', () => {
    setup({ isCedarMode: true, cedarTemplate: MOCK_CEDAR_TEMPLATE });

    fixture.componentRef.setInput('cedarTemplate', null);
    fixture.detectChanges();

    const cedarDataSavedSpy = vi.spyOn(component.cedarDataSaved, 'emit');

    component.handleSaveCedarMetadata();

    expect(cedarDataSavedSpy).not.toHaveBeenCalled();
  });
});
