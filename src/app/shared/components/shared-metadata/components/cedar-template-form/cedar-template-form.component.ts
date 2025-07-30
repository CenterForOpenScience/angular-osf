import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  input,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { CEDAR_CONFIG } from '@osf/features/project/metadata/constants';
import { CedarMetadataHelper } from '@osf/features/project/metadata/helpers';
import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
} from '@osf/features/project/metadata/models';

interface CedarEditorElement extends HTMLElement {
  currentMetadata?: unknown;
}

@Component({
  selector: 'osf-cedar-template-form',
  imports: [CommonModule, Button, TranslatePipe],
  templateUrl: './cedar-template-form.component.html',
  styleUrl: './cedar-template-form.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CedarTemplateFormComponent implements OnInit {
  emitData = output<CedarRecordDataBinding>();
  changeTemplate = output<void>();
  editMode = output<void>();

  template = input.required<CedarMetadataDataTemplateJsonApi>();
  existingRecord = input<CedarMetadataRecordData | null>(null);
  readonly = input<boolean>(false);
  showEditButton = input<boolean>(false);

  formData = signal<Record<string, unknown>>({});

  cedarConfig = CEDAR_CONFIG;

  constructor() {
    effect(() => {
      this.cedarConfig.readOnlyMode = this.readonly() ?? false;

      const tpl = this.template();
      if (tpl?.attributes?.template) {
        this.initializeFormData();
      }
    });
  }

  ngOnInit() {
    this.initializeFormData();
  }

  onCedarChange(event: Event): void {
    const customEvent = event as CustomEvent;

    if (customEvent && customEvent.target) {
      const cedarEditor = customEvent.target as CedarEditorElement;
      if (cedarEditor && typeof cedarEditor.currentMetadata !== 'undefined') {
        const currentData = cedarEditor.currentMetadata;
        this.formData.set(currentData as Record<string, unknown>);
      }
    }
  }

  editModeEmit(): void {
    this.editMode.emit();
    this.cedarConfig = { ...this.cedarConfig, readOnlyMode: false };
  }

  onSubmit() {
    const cedarEditor = document.querySelector('cedar-embeddable-editor') as CedarEditorElement;
    if (cedarEditor && typeof cedarEditor.currentMetadata !== 'undefined') {
      const finalData = { data: cedarEditor.currentMetadata, id: this.template().id };
      this.formData.set(finalData);
      this.emitData.emit(finalData as CedarRecordDataBinding);
    }
  }

  private initializeFormData(): void {
    const template = this.template()?.attributes?.template;

    if (!template) return;
    const metadata = this.existingRecord()?.attributes?.metadata;

    if (this.existingRecord()) {
      const structuredMetadata = CedarMetadataHelper.buildStructuredMetadata(metadata);
      this.formData.set(structuredMetadata);
    } else {
      this.formData.set(CedarMetadataHelper.buildEmptyMetadata());
    }
  }
}
