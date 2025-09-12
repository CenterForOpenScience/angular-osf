import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Step, StepItem, StepPanel } from 'primeng/stepper';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { collectionFilterTypes } from '@osf/features/collections/constants/filter-types.const';
import { AddToCollectionSteps } from '@osf/features/collections/enums';
import { CollectionFilterEntry } from '@osf/features/collections/models';
import { CollectionsSelectors, GetCollectionDetails } from '@shared/stores';

@Component({
  selector: 'osf-collection-metadata-step',
  imports: [Button, TranslatePipe, Select, ReactiveFormsModule, Step, StepItem, StepPanel, Tooltip],
  templateUrl: './collection-metadata-step.component.html',
  styleUrl: './collection-metadata-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionMetadataStepComponent {
  private readonly filterTypes = collectionFilterTypes;
  readonly collectionFilterOptions = select(CollectionsSelectors.getAllFiltersOptions);
  readonly availableFilterEntries = computed(() => {
    const options = this.collectionFilterOptions();

    return this.filterTypes
      .map((key: string, index: number) => ({
        key,
        value: index.toString(),
        options: options[key as keyof typeof options] || [],
        labelKey: `collections.filters.${key}.label`,
      }))
      .filter((entry: CollectionFilterEntry) => entry.options.length);
  });

  stepperActiveValue = input.required<number>();
  targetStepValue = input.required<number>();
  isDisabled = input.required<boolean>();
  primaryCollectionId = input<string | undefined>();

  stepChange = output<number>();
  metadataSaved = output<FormGroup>();

  collectionMetadataForm = signal<FormGroup>(new FormGroup({}));
  collectionMetadataSaved = signal<boolean>(false);
  originalFormValues = signal<Record<string, unknown>>({});

  actions = createDispatchMap({
    getCollectionDetails: GetCollectionDetails,
  });

  constructor() {
    this.setupEffects();
  }

  handleEditStep() {
    this.stepChange.emit(this.targetStepValue());
  }

  handleDiscardChanges() {
    const form = this.collectionMetadataForm();
    const originalValues = this.originalFormValues();

    if (this.hasFormChanges(form, originalValues)) {
      this.restoreFormValues(form, originalValues);
    }

    this.collectionMetadataSaved.set(false);
  }

  handleSaveMetadata() {
    const form = this.collectionMetadataForm();

    this.updateOriginalValues(form);

    this.collectionMetadataSaved.set(true);
    this.metadataSaved.emit(form);
    this.stepChange.emit(AddToCollectionSteps.Complete);
  }

  private buildCollectionMetadataForm() {
    const filterEntries = this.availableFilterEntries();
    const formControls: Record<string, FormControl> = {};

    filterEntries.forEach((entry: CollectionFilterEntry) => {
      formControls[entry.key] = new FormControl('', [Validators.required]);
    });

    const newForm = new FormGroup(formControls);
    this.collectionMetadataForm.set(newForm);
    this.updateOriginalValues(newForm);
  }

  private setupEffects(): void {
    effect(() => {
      const collectionId = this.primaryCollectionId();
      if (collectionId) {
        this.actions.getCollectionDetails(collectionId);
      }
    });

    effect(() => {
      const filterEntries = this.availableFilterEntries();
      if (filterEntries.length) {
        this.buildCollectionMetadataForm();
      }
    });

    effect(() => {
      if (!this.collectionMetadataSaved() && this.stepperActiveValue() !== AddToCollectionSteps.CollectionMetadata) {
        this.collectionMetadataForm().reset();
      }
    });
  }

  private hasFormChanges(form: FormGroup, originalValues: Record<string, unknown>): boolean {
    return Object.keys(originalValues).some((key) => {
      const currentValue = form.get(key)?.value;
      const originalValue = originalValues[key];
      return currentValue !== originalValue;
    });
  }

  private restoreFormValues(form: FormGroup, originalValues: Record<string, unknown>): void {
    Object.keys(originalValues).forEach((key) => {
      form.get(key)?.setValue(originalValues[key]);
    });
  }

  private updateOriginalValues(form: FormGroup): void {
    const currentValues: Record<string, unknown> = {};
    Object.keys(form.controls).forEach((key) => {
      currentValues[key] = form.get(key)?.value;
    });
    this.originalFormValues.set(currentValues);
  }
}
