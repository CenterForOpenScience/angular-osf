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
  protected readonly collectionFilterOptions = select(CollectionsSelectors.getAllFiltersOptions);
  protected readonly availableFilterEntries = computed(() => {
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

  protected collectionMetadataForm = signal<FormGroup>(new FormGroup({}));
  protected collectionMetadataSaved = signal<boolean>(false);

  protected actions = createDispatchMap({
    getCollectionDetails: GetCollectionDetails,
  });

  constructor() {
    this.setupEffects();
  }

  handleEditStep() {
    this.stepChange.emit(this.targetStepValue());
  }

  handleDiscardChanges() {
    this.collectionMetadataForm().reset();
    this.collectionMetadataSaved.set(false);
  }

  handleSaveMetadata() {
    this.collectionMetadataSaved.set(true);
    this.metadataSaved.emit(this.collectionMetadataForm());
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
}
