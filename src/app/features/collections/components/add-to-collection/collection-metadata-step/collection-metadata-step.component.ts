import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Step, StepItem, StepPanel } from 'primeng/stepper';
import { Tooltip } from 'primeng/tooltip';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  output,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { AddToCollectionSteps } from '@osf/features/collections/enums';
import { CEDAR_CONFIG, CEDAR_VIEWER_CONFIG } from '@osf/features/metadata/constants';
import {
  CedarEditorElement,
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecordDataJsonApi,
  CedarRecordDataBinding,
} from '@osf/features/metadata/models';

@Component({
  selector: 'osf-collection-metadata-step',
  imports: [Button, TranslatePipe, Step, StepItem, StepPanel, Tooltip],
  templateUrl: './collection-metadata-step.component.html',
  styleUrl: './collection-metadata-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})
export class CollectionMetadataStepComponent {
  stepperActiveValue = input.required<number>();
  targetStepValue = input.required<number>();
  isDisabled = input.required<boolean>();
  cedarTemplate = input<CedarMetadataDataTemplateJsonApi | null>(null);
  existingCedarRecord = input<CedarMetadataRecordDataJsonApi | null>(null);

  stepChange = output<number>();
  cedarDataSaved = output<CedarRecordDataBinding>();

  collectionMetadataSaved = signal<boolean>(false);
  cedarFormData = signal<Record<string, unknown>>({});

  cedarConfig = CEDAR_CONFIG;
  cedarViewerConfig = CEDAR_VIEWER_CONFIG;

  cedarEditor = viewChild<ElementRef<CedarEditorElement>>('cedarEditor');
  cedarViewer = viewChild<ElementRef<CedarEditorElement>>('cedarViewer');

  readonly isStepActive = computed(() => this.stepperActiveValue() === this.targetStepValue());

  constructor() {
    this.setupEffects();
  }

  handleEditStep() {
    this.stepChange.emit(this.targetStepValue());
  }

  handleDiscardChanges() {
    const record = this.existingCedarRecord();
    this.cedarFormData.set(record?.attributes?.metadata ? (record.attributes.metadata as Record<string, unknown>) : {});
    this.syncCedarInstance(this.cedarEditor()?.nativeElement);
    this.collectionMetadataSaved.set(false);
  }

  handleSaveCedarMetadata() {
    const editor = this.cedarEditor()?.nativeElement;
    const template = this.cedarTemplate();
    if (!editor || !template) return;

    const currentMetadata = editor.currentMetadata ?? this.cedarFormData();
    const isValid = !!editor.dataQualityReport?.isValid;

    if (currentMetadata) {
      this.cedarFormData.set(currentMetadata as Record<string, unknown>);
    }

    const cedarData: CedarRecordDataBinding = {
      data: currentMetadata as CedarRecordDataBinding['data'],
      id: template.id,
      isPublished: isValid,
    };

    this.collectionMetadataSaved.set(true);
    this.cedarDataSaved.emit(cedarData);
    this.stepChange.emit(AddToCollectionSteps.Complete);
  }

  onCedarChange(event: Event): void {
    const customEvent = event as CustomEvent;
    if (customEvent?.target) {
      const editor = customEvent.target as CedarEditorElement;
      if (editor && typeof editor.currentMetadata !== 'undefined') {
        this.cedarFormData.set(editor.currentMetadata as Record<string, unknown>);
      }
    }
  }

  private setupEffects(): void {
    effect(() => {
      if (this.collectionMetadataSaved()) return;

      const record = this.existingCedarRecord();
      if (record?.attributes?.metadata) {
        this.cedarFormData.set(record.attributes.metadata as Record<string, unknown>);
      }
    });

    effect(() => {
      if (!this.isStepActive()) return;

      const record = this.existingCedarRecord();
      const saved = this.collectionMetadataSaved();

      if (!record?.attributes?.metadata && !saved) return;

      this.syncCedarInstance(this.cedarEditor()?.nativeElement);
    });

    effect(() => {
      if (this.isStepActive() || !this.collectionMetadataSaved()) return;
      this.syncCedarInstance(this.cedarViewer()?.nativeElement);
    });
  }

  private syncCedarInstance(element: CedarEditorElement | undefined): void {
    if (element) {
      element.instanceObject = untracked(() => this.cedarFormData());
    }
  }
}
