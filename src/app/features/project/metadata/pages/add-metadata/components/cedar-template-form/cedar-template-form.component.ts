import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  CedarMetadataAttributes,
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
})
export class CedarTemplateFormComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  emitData = output<CedarRecordDataBinding>();
  changeTemplate = output<void>();
  editMode = output<void>();

  template = input.required<CedarMetadataDataTemplateJsonApi>();
  existingRecord = input<CedarMetadataRecordData | null>();
  readonly = input<boolean>(false);
  showEditButton = input<boolean>();

  formData = signal<Record<string, unknown>>({});

  cedarConfig = {
    showSampleTemplateLinks: false,
    terminologyIntegratedSearchUrl: 'https://terminology.metadatacenter.org/bioportal/integrated-search',
    showTemplateRenderingRepresentation: false,
    showInstanceDataCore: false,
    showMultiInstanceInfo: false,
    showInstanceDataFull: false,
    showTemplateSourceData: false,
    showDataQualityReport: false,
    showHeader: false,
    showFooter: false,
    readOnlyMode: false,
    hideEmptyFields: false,
    showPreferencesMenu: false,
    strictValidation: false,
    autoInitializeFields: true,
  };

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
      const structuredMetadata = this.buildStructuredMetadata(metadata);
      this.formData.set(structuredMetadata);
    } else {
      this.formData.set(this.buildEmptyMetadata());
    }
  }

  private ensureProperStructure(items: unknown): Record<string, unknown>[] {
    if (!Array.isArray(items)) return [];

    return items.map((item) => {
      const safeItem = typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {};
      return {
        '@id': safeItem['@id'] ?? '',
        '@type': safeItem['@type'] ?? '',
        'rdfs:label': safeItem['rdfs:label'] ?? null,
      };
    });
  }

  private buildStructuredMetadata(metadata: CedarMetadataAttributes | undefined): Record<string, unknown> {
    const keysToFix = [
      'Constructs',
      'Assessments',
      'Project Methods',
      'Participant Types',
      'Special Populations',
      'Educational Curricula',
      'LDbaseInvestigatorORCID',
    ];

    const fixedMetadata: Record<string, unknown> = { ...metadata };

    const raw = metadata as Record<string, unknown>;

    for (const key of keysToFix) {
      const value = raw[key];
      if (value) {
        fixedMetadata[key] = this.ensureProperStructure(value);
      }
    }

    return fixedMetadata;
  }

  private buildEmptyMetadata(): Record<string, unknown> {
    return {
      '@context': {},
      Constructs: this.ensureProperStructure([]),
      Assessments: this.ensureProperStructure([]),
      'Project Methods': this.ensureProperStructure([]),
      'Participant Types': this.ensureProperStructure([]),
      'Special Populations': this.ensureProperStructure([]),
      'Educational Curricula': this.ensureProperStructure([]),
      LDbaseInvestigatorORCID: this.ensureProperStructure([]),
    };
  }

  protected readonly Object = Object;
}
