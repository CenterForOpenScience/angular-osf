import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, HostBinding, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { CedarTemplateFormComponent } from '@osf/features/project/metadata/components';
import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
} from '@osf/features/project/metadata/models';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';
import { ToastService } from '@shared/services';

import {
  CreateCedarMetadataRecord,
  GetCedarMetadataRecords,
  GetCedarMetadataTemplates,
  ProjectMetadataSelectors,
  UpdateCedarMetadataRecord,
} from '../../store';

@Component({
  selector: 'osf-add-metadata',
  imports: [SubHeaderComponent, Button, TranslatePipe, CedarTemplateFormComponent, Tooltip, LoadingSpinnerComponent],
  templateUrl: './add-metadata.component.html',
  styleUrl: './add-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMetadataComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full h-full';
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);

  private projectId = '';
  protected isEditMode = true;
  protected selectedTemplate: CedarMetadataDataTemplateJsonApi | null = null;
  protected existingRecord: CedarMetadataRecordData | null = null;

  protected readonly cedarTemplates = select(ProjectMetadataSelectors.getCedarTemplates);
  protected readonly cedarRecords = select(ProjectMetadataSelectors.getCedarRecords);
  protected readonly cedarTemplatesLoading = select(ProjectMetadataSelectors.getCedarTemplatesLoading);

  protected actions = createDispatchMap({
    getCedarTemplates: GetCedarMetadataTemplates,
    getCedarRecords: GetCedarMetadataRecords,
    createCedarMetadataRecord: CreateCedarMetadataRecord,
    updateCedarMetadataRecord: UpdateCedarMetadataRecord,
  });

  get isEditingExistingRecord(): boolean {
    return !!this.activatedRoute.snapshot.params['record-id'];
  }

  constructor() {
    effect(() => {
      const records = this.cedarRecords();
      const cedarTemplatesData = this.cedarTemplates()?.data;
      const recordId = this.activatedRoute.snapshot.params['record-id'];

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
            this.selectedTemplate = matchingTemplate;
            this.existingRecord = existingRecord;
            this.isEditMode = false;
          }
        }
      } else {
        this.selectedTemplate = null;
        this.existingRecord = null;
        this.isEditMode = true;
      }
    });
  }

  ngOnInit(): void {
    const urlSegments = this.activatedRoute.snapshot.pathFromRoot
      .map((segment) => segment.url.map((url) => url.path))
      .flat();
    const projectIdIndex = urlSegments.findIndex((segment) => segment === 'my-projects') + 1;
    if (projectIdIndex > 0 && projectIdIndex < urlSegments.length) {
      this.projectId = urlSegments[projectIdIndex];
      this.actions.getCedarRecords(this.projectId);
    }

    this.actions.getCedarTemplates();
  }

  onSelect(template: CedarMetadataDataTemplateJsonApi): void {
    if (this.hasExistingRecord(template.id)) {
      return;
    }
    this.selectedTemplate = template;
  }

  onCancel(): void {
    const templates = this.cedarTemplates();
    if (templates?.links?.first && templates?.links?.last && templates.links.first !== templates.links.last) {
      this.actions.getCedarTemplates();
    } else {
      this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }
  }

  onNext(): void {
    const templates = this.cedarTemplates();
    if (!templates?.links?.next) {
      return;
    }
    this.actions.getCedarTemplates(templates.links.next);
  }

  hasNextPage(): boolean {
    const templates = this.cedarTemplates();
    return !!templates?.links?.next;
  }

  hasMultiplePages(): boolean {
    const templates = this.cedarTemplates();
    return !!(templates?.links?.first && templates?.links?.last && templates.links.first !== templates.links.last);
  }

  disableSelect(): void {
    this.selectedTemplate = null;
  }

  hasExistingRecord(templateId: string): boolean {
    const records = this.cedarRecords();
    if (!records) return false;

    return records.some((record) => record.relationships.template.data.id === templateId);
  }

  createRecordMetadata(data: CedarRecordDataBinding): void {
    const model: CedarMetadataRecord = {
      data: {
        type: 'cedar_metadata_records',
        attributes: {
          metadata: data.data,
          is_published: false,
        },
        relationships: {
          template: {
            data: {
              type: 'cedar-metadata-templates',
              id: data.id,
            },
          },
          target: {
            data: {
              type: 'nodes',
              id: this.projectId,
            },
          },
        },
      },
    };

    const recordId = this.activatedRoute.snapshot.params['record-id'];

    if (recordId && this.existingRecord) {
      this.actions
        .updateCedarMetadataRecord(model, recordId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toggleEditMode();
            this.toastService.showSuccess('project.metadata.addMetadata.recordUpdatedSuccessfully');
          },
        });
    } else {
      this.actions
        .createCedarMetadataRecord(model)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toggleEditMode();
            this.toastService.showSuccess('project.metadata.addMetadata.recordCreatedSuccessfully');
          },
        });
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }
}
