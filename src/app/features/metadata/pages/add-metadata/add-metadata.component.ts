import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { ResourceType } from '@osf/shared/enums';
import { IS_MEDIUM } from '@osf/shared/helpers';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';
import { ToastService } from '@shared/services';

import { CedarTemplateFormComponent } from '../../components';
import { CedarMetadataDataTemplateJsonApi, CedarMetadataRecordData, CedarRecordDataBinding } from '../../models';
import {
  CreateCedarMetadataRecord,
  GetCedarMetadataRecords,
  GetCedarMetadataTemplates,
  MetadataSelectors,
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
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly isMedium = toSignal(inject(IS_MEDIUM));

  private resourceId = '';
  isEditMode = true;
  selectedTemplate: CedarMetadataDataTemplateJsonApi | null = null;
  existingRecord: CedarMetadataRecordData | null = null;

  readonly cedarTemplates = select(MetadataSelectors.getCedarTemplates);
  readonly cedarRecords = select(MetadataSelectors.getCedarRecords);
  readonly cedarTemplatesLoading = select(MetadataSelectors.getCedarTemplatesLoading);
  readonly cedarRecord = select(MetadataSelectors.getCedarRecord);

  actions = createDispatchMap({
    getCedarTemplates: GetCedarMetadataTemplates,
    getCedarRecords: GetCedarMetadataRecords,
    createCedarMetadataRecord: CreateCedarMetadataRecord,
    updateCedarMetadataRecord: UpdateCedarMetadataRecord,
  });

  resourceType = signal<ResourceType>(this.activeRoute.parent?.snapshot.data['resourceType'] || ResourceType.Project);

  constructor() {
    effect(() => {
      const records = this.cedarRecords();
      const cedarTemplatesData = this.cedarTemplates()?.data;
      const recordId = this.activatedRoute.snapshot.params['recordId'];

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
    this.resourceId = this.activeRoute.parent?.parent?.snapshot.params['id'];

    if (this.resourceId) {
      this.actions.getCedarRecords(this.resourceId, this.resourceType());
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
      if (this.resourceType() === ResourceType.File) {
        this.router.navigate([this.resourceId]);
      } else {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
      }
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
    const recordId = this.activatedRoute.snapshot.params['recordId'];

    if (recordId && this.existingRecord) {
      this.actions
        .updateCedarMetadataRecord(data, recordId, this.resourceId, this.resourceType())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toggleEditMode();
            this.toastService.showSuccess('project.metadata.addMetadata.recordUpdatedSuccessfully');
          },
        });
    } else {
      this.actions
        .createCedarMetadataRecord(data, this.resourceId, this.resourceType())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toggleEditMode();
            this.toastService.showSuccess('project.metadata.addMetadata.recordCreatedSuccessfully');
            this.navigateToRecord(this.resourceId, this.resourceType());
          },
        });
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  private navigateToRecord(resourceId: string, resourceType: ResourceType): void {
    const recordId = this.cedarRecord()?.data.id;
    if (resourceType === ResourceType.File) {
      this.router.navigate([resourceId]);
    } else {
      this.router.navigate(['../', recordId], { relativeTo: this.activatedRoute });
    }
  }
}
