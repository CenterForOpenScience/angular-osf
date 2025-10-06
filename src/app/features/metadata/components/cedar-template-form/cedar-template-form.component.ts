import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tooltip } from 'primeng/tooltip';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
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
  imports: [CommonModule, Button, TranslatePipe, Tooltip, Menu],
  templateUrl: './cedar-template-form.component.html',
  styleUrl: './cedar-template-form.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CedarTemplateFormComponent {
  emitData = output<CedarRecordDataBinding>();
  changeTemplate = output<void>();
  toggleEditMode = output<void>();

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

  private route = inject(ActivatedRoute);
  readonly environment = inject(ENVIRONMENT);

  readonly recordId = signal<string>('');
  readonly downloadUrl = signal<string>('');
  readonly schemaName = signal<string>('');

  shareItems = [
    {
      label: 'files.detail.actions.share.email',
      command: () => this.handleEmailShare(),
    },
    {
      label: 'files.detail.actions.share.x',
      command: () => this.handleXShare(),
    },
    {
      label: 'files.detail.actions.share.facebook',
      command: () => this.handleFacebookShare(),
    },
  ];

  constructor() {
    effect(() => {
      const tpl = this.template();
      if (tpl?.attributes?.template) {
        this.initializeCedar();
      }
    });

    effect(() => {
      const record = this.existingRecord();
      this.schemaName.set(record?.embeds?.template.data.attributes.schema_name || '');
      if (record) {
        this.initializeCedar();
      }
    });
  }

  private initializeCedar(): void {
    const metadata = this.existingRecord()?.attributes?.metadata;
    const editor = this.cedarEditor()?.nativeElement;
    const viewer = this.cedarViewer()?.nativeElement;

    this.initializeFormData();

    if (metadata) {
      if (editor) editor.instanceObject = metadata;
      if (viewer) viewer.instanceObject = metadata;
    }

    const id = this.route.snapshot.paramMap.get('recordId') ?? '';
    this.recordId.set(id);

    this.downloadUrl.set(`${this.environment.apiDomainUrl}/_/cedar_metadata_records/${id}/metadata_download/`);

    this.validateCedarMetadata();
  }

  downloadFile() {
    window.open(this.downloadUrl(), '_blank');
  }

  copyUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then();
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

  toggleEditModeEmit(): void {
    this.toggleEditMode.emit();
  }

  cancel() {
    this.initializeFormData();
    this.toggleEditModeEmit();
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

  handleEmailShare(): void {
    const url = window.location.href;
    window.location.href = `mailto:?subject=${this.schemaName()}&body=${url}`;
  }

  handleXShare(): void {
    const url = window.location.href;
    const link = `https://x.com/intent/tweet?url=${url}&text=${this.schemaName()}&via=OSFramework`;
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  handleFacebookShare(): void {
    const url = window.location.href;
    const link = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}
