import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
} from '@osf/features/project/metadata/models';
import { CedarFormMapper } from '@osf/features/registry/mappers';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';
import { CedarTemplateFormComponent } from '@shared/components/shared-metadata/components';
import { ToastService } from '@shared/services';

import {
  CreateCedarMetadataRecord,
  GetCedarMetadataTemplates,
  GetRegistryCedarMetadataRecords,
  RegistryMetadataSelectors,
} from '../../store/registry-metadata';

@Component({
  selector: 'osf-registry-metadata-add',
  imports: [SubHeaderComponent, CedarTemplateFormComponent, LoadingSpinnerComponent, TranslatePipe, Button, Tooltip],
  templateUrl: './registry-metadata-add.component.html',
  styleUrl: './registry-metadata-add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryMetadataAddComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  isEditMode = true;

  private registryId = '';

  existingRecord = signal<CedarMetadataRecordData | null>(null);
  selectedTemplate = signal<CedarMetadataDataTemplateJsonApi | null>(null);
  isSubmitting = signal<boolean>(false);

  protected actions = createDispatchMap({
    getCedarTemplates: GetCedarMetadataTemplates,
    getCedarRecords: GetRegistryCedarMetadataRecords,
    createCedarRecord: CreateCedarMetadataRecord,
  });

  protected cedarRecords = select(RegistryMetadataSelectors.getCedarRecords);
  protected cedarTemplates = select(RegistryMetadataSelectors.getCedarTemplates);
  protected cedarTemplatesLoading = select(RegistryMetadataSelectors.getCedarTemplatesLoading);
  protected cedarRecord = select(RegistryMetadataSelectors.getCedarRecord);

  constructor() {
    effect(() => {
      const records = this.cedarRecords();
      const cedarTemplatesData = this.cedarTemplates()?.data;
      const recordId = this.route.snapshot.params['record-id'];

      if (!records || !cedarTemplatesData) {
        return;
      }

      if (recordId) {
        const existingRecord = records.find((record) => {
          return record.id === recordId;
        });

        if (existingRecord) {
          const templateId = existingRecord.relationships.template.data.id;
          const matchingTemplate = cedarTemplatesData.find((template) => template.id === templateId);

          if (matchingTemplate) {
            this.selectedTemplate.set(matchingTemplate);
            this.existingRecord.set(existingRecord);
            this.isEditMode = false;
          }
        }
      } else {
        this.selectedTemplate.set(null);
        this.existingRecord.set(null);
        this.isEditMode = true;
      }
    });
  }

  ngOnInit(): void {
    this.registryId = this.route.parent?.parent?.snapshot.params['id'];

    if (this.registryId) {
      this.actions.getCedarTemplates();
      this.actions.getCedarRecords(this.registryId);
    }
  }

  hasMultiplePages(): boolean {
    const templates = this.cedarTemplates();
    return !!(templates?.links?.first && templates?.links?.last && templates.links.first !== templates.links.last);
  }

  hasNextPage(): boolean {
    const templates = this.cedarTemplates();
    return !!templates?.links?.next;
  }

  hasExistingRecord(templateId: string): boolean {
    const records = this.cedarRecords();
    if (!records) return false;

    return records.some((record) => record.relationships.template.data.id === templateId);
  }

  onTemplateSelected(template: CedarMetadataDataTemplateJsonApi): void {
    this.selectedTemplate.set(template);
  }

  onSubmit(data: CedarRecordDataBinding): void {
    const registryId = this.registryId;
    if (!registryId) return;

    this.isSubmitting.set(true);

    const model = CedarFormMapper(data, registryId);

    this.actions
      .createCedarRecord(model)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.toastService.showSuccess('project.overview.metadata.cedarRecordCreatedSuccessfully');
          this.router.navigate(['../metadata', this.cedarRecord()?.data.id], { relativeTo: this.route.parent });
        },
        error: () => {
          this.isSubmitting.set(false);
          this.toastService.showError('project.overview.metadata.failedToCreateCedarRecord');
        },
      });
  }

  onChangeTemplate(): void {
    this.selectedTemplate.set(null);
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  onNext(): void {
    const templates = this.cedarTemplates();
    if (!templates?.links?.next) {
      return;
    }
    this.actions.getCedarTemplates(templates.links.next);
  }

  onCancel(): void {
    const templates = this.cedarTemplates();
    if (templates?.links?.first && templates?.links?.last && templates.links.first !== templates.links.last) {
      this.actions.getCedarTemplates();
    } else {
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }
}
