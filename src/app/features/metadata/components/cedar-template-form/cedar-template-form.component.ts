import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  OnInit,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { CEDAR_CONFIG, CEDAR_VIEWER_CONFIG } from '@osf/features/metadata/constants';
import { CedarMetadataHelper } from '@osf/features/metadata/helpers';
import {
  CedarEditorElement,
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
} from '@osf/features/metadata/models';

import 'cedar-artifact-viewer';

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
  cedarViewerConfig = CEDAR_VIEWER_CONFIG;
  isValid = false;
  cedarEditor = viewChild<ElementRef<CedarEditorElement>>('cedarEditor');
  cedarViewer = viewChild<ElementRef<CedarEditorElement>>('cedarViewer');

  constructor() {
    effect(() => {
      const tpl = this.template();
      if (tpl?.attributes?.template) {
        this.initializeFormData();
      }
    });

    effect(() => {
      const editor = this.cedarEditor()?.nativeElement;
      const viewer = this.cedarViewer()?.nativeElement;
      const metadata = this.existingRecord()?.attributes?.metadata;
      if (metadata) {
        if (editor) {
          editor.instanceObject = metadata;
        }
        if (viewer) {
          viewer.instanceObject = metadata;
        }
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
    this.validateCedarMetadata();
  }

  validateCedarMetadata() {
    const report = this.cedarEditor()?.nativeElement.dataQualityReport;
    this.isValid = !!report?.isValid;
  }

  editModeEmit(): void {
    this.editMode.emit();
  }

  onSubmit() {
    const editor = this.cedarEditor()?.nativeElement;
    if (editor && typeof editor.currentMetadata !== 'undefined') {
      const finalData = { data: editor.currentMetadata, id: this.template().id, isPublished: this.isValid };
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
