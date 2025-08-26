import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { EMPTY, filter, switchMap } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MetadataTabsComponent, SubHeaderComponent } from '@osf/shared/components';
import { CedarTemplateFormComponent } from '@osf/shared/components/shared-metadata/components';
import {
  ContributorsDialogComponent,
  DescriptionDialogComponent,
  FundingDialogComponent,
  LicenseDialogComponent,
  ResourceInformationDialogComponent,
} from '@osf/shared/components/shared-metadata/dialogs';
import { SharedMetadataComponent } from '@osf/shared/components/shared-metadata/shared-metadata.component';
import { MetadataResourceEnum, ResourceType } from '@osf/shared/enums';
import { MetadataTabsModel, SubjectModel } from '@osf/shared/models';
import { CustomConfirmationService, ToastService } from '@osf/shared/services';
import {
  ContributorsSelectors,
  FetchChildrenSubjects,
  FetchSelectedSubjects,
  FetchSubjects,
  GetAllContributors,
  SubjectsSelectors,
  UpdateResourceSubjects,
} from '@osf/shared/stores';

import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
} from './models';
import {
  GetCustomItemMetadata,
  GetResourceMetadata,
  MetadataSelectors,
  UpdateCustomItemMetadata,
  UpdateResourceDetails,
  UpdateResourceLicense,
} from './store';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-metadata',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    MetadataTabsComponent,
    SharedMetadataComponent,
    CedarTemplateFormComponent,
  ],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class MetadataComponent implements OnInit {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly toastService = inject(ToastService);
  // private readonly loaderService = inject(LoaderService);
  private readonly customConfirmationService = inject(CustomConfirmationService);

  private resourceId = '';

  tabs = signal<MetadataTabsModel[]>([]);
  readonly selectedTab = signal('osf');

  selectedCedarRecord = signal<CedarMetadataRecordData | null>(null);
  selectedCedarTemplate = signal<CedarMetadataDataTemplateJsonApi | null>(null);
  cedarFormReadonly = signal<boolean>(true);
  metadata = select(MetadataSelectors.getResourceMetadata);
  isLoading = select(MetadataSelectors.getLoading);
  customItemMetadata = select(MetadataSelectors.getCustomItemMetadata);
  contributors = select(ContributorsSelectors.getContributors);
  isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  cedarRecords = select(MetadataSelectors.getCedarRecords);
  cedarTemplates = select(MetadataSelectors.getCedarTemplates);
  selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  isSubjectsUpdating = select(SubjectsSelectors.areSelectedSubjectsLoading);
  resourceType = signal<ResourceType>(this.activeRoute.parent?.snapshot.data['resourceType'] || ResourceType.Project);
  isSubmitting = select(MetadataSelectors.getSubmitting);

  provider = environment.defaultProvider;

  actions = createDispatchMap({
    getResourceMetadata: GetResourceMetadata,
    updateMetadata: UpdateResourceDetails,
    updateResourceLicense: UpdateResourceLicense,
    getCustomItemMetadata: GetCustomItemMetadata,
    updateCustomItemMetadata: UpdateCustomItemMetadata,
    getContributors: GetAllContributors,
    // getUserInstitutions: GetUserInstitutions,
    // getCedarRecords: GetCedarMetadataRecords,
    // getCedarTemplates: GetCedarMetadataTemplates,
    // createCedarRecord: CreateCedarMetadataRecord,
    // updateCedarRecord: UpdateCedarMetadataRecord,

    fetchSubjects: FetchSubjects,
    fetchSelectedSubjects: FetchSelectedSubjects,
    fetchChildrenSubjects: FetchChildrenSubjects,
    updateResourceSubjects: UpdateResourceSubjects,
  });

  constructor() {
    effect(() => {
      const records = this.cedarRecords();

      const baseTabs = [{ id: 'osf', label: 'OSF', type: MetadataResourceEnum.PROJECT }];

      const cedarTabs =
        records?.map((record) => ({
          id: record.id || '',
          label: record.embeds?.template?.data?.attributes?.schema_name || `Record ${record.id}`,
          type: MetadataResourceEnum.CEDAR,
        })) || [];

      this.tabs.set([...baseTabs, ...cedarTabs]);
      this.handleRouteBasedTabSelection();
    });

    effect(() => {
      const templates = this.cedarTemplates();
      const selectedRecord = this.selectedCedarRecord();

      if (selectedRecord && templates?.data && !this.selectedCedarTemplate()) {
        const templateId = selectedRecord.relationships?.template?.data?.id;
        if (templateId) {
          const template = templates.data.find((t) => t.id === templateId);
          if (template) {
            this.selectedCedarTemplate.set(template);
          }
        }
      }
    });

    effect(() => {
      console.log('customItemMetadata:', this.customItemMetadata());
      const metadata = this.metadata();
      if (this.resourceType() === ResourceType.Registration) {
        if (metadata) {
          this.provider = metadata.provider || environment.defaultProvider;
          this.actions.fetchSubjects(this.resourceType(), this.provider);
        }
      } else {
        this.actions.fetchSubjects(this.resourceType());
      }
    });
  }

  ngOnInit(): void {
    this.resourceId = this.activeRoute.parent?.parent?.snapshot.params['id'];

    console.log(this.resourceId);
    console.log(this.resourceType());

    if (this.resourceId && this.resourceType()) {
      this.actions.getResourceMetadata(this.resourceId, this.resourceType());
      this.actions.getCustomItemMetadata(this.resourceId);
      this.actions.getContributors(this.resourceId, this.resourceType());
      // this.actions.getCedarRecords(this.resourceId);
      // this.actions.getCedarTemplates();
      this.actions.fetchSelectedSubjects(this.resourceId, this.resourceType());
      // const user = this.currentUser();
      // if (user?.id) {
      //   this.actions.getUserInstitutions(user.id);
      // }
    }
  }
  onTabChange(tabId: string | number): void {
    const tab = this.tabs().find((x) => x.id === tabId.toString());

    if (!tab) {
      return;
    }

    this.selectedTab.set(tab.id as MetadataResourceEnum);

    if (tab.type === 'cedar') {
      this.loadCedarRecord(tab.id);

      const currentRecordId = this.activeRoute.snapshot.paramMap.get('recordId');
      if (currentRecordId !== tab.id) {
        this.router.navigate(['metadata', tab.id], { relativeTo: this.activeRoute.parent?.parent });
      }
    } else {
      this.selectedCedarRecord.set(null);
      this.selectedCedarTemplate.set(null);

      const currentRecordId = this.activeRoute.snapshot.paramMap.get('recordId');
      if (currentRecordId) {
        this.router.navigate(['metadata'], { relativeTo: this.activeRoute.parent?.parent });
      }
    }
  }

  onCedarFormEdit(): void {
    this.cedarFormReadonly.set(false);
  }

  onCedarFormSubmit(data: CedarRecordDataBinding): void {
    const selectedRecord = this.selectedCedarRecord();

    if (!this.resourceId || !selectedRecord) return;

    const model = {
      data: {
        type: 'cedar_metadata_records' as const,
        attributes: {
          metadata: data.data,
          is_published: false,
        },
        relationships: {
          template: {
            data: {
              type: 'cedar-metadata-templates' as const,
              id: data.id,
            },
          },
          target: {
            data: {
              type: 'nodes' as const,
              id: this.resourceId,
            },
          },
        },
      },
    } as CedarMetadataRecord;

    if (selectedRecord.id) {
      // this.actions
      //   .updateCedarRecord(model, selectedRecord.id)
      //   .pipe(takeUntilDestroyed(this.destroyRef))
      //   .subscribe({
      //     next: () => {
      //       this.cedarFormReadonly.set(true);
      //       this.toastService.showSuccess('CEDAR record updated successfully');
      //       this.actions.getCedarRecords(projectId);
      //     },
      //   });
    }
  }

  onCedarFormChangeTemplate(): void {
    this.router.navigate(['add'], { relativeTo: this.activeRoute });
  }

  openAddRecord(): void {
    this.router.navigate(['add'], { relativeTo: this.activeRoute });
  }

  onTagsChanged(tags: string[]): void {
    this.actions.updateMetadata(this.resourceId, this.resourceType(), { tags });
  }

  openEditContributorDialog(): void {
    const dialogRef = this.dialogService.open(ContributorsDialogComponent, {
      width: '800px',
      header: this.translateService.instant('project.metadata.contributors.editContributors'),
      focusOnShow: false,
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        resourceId: this.resourceId,
        resourceType: this.resourceType(),
        contributors: this.contributors(),
        isLoading: this.isContributorsLoading(),
      },
    });
    dialogRef.onClose.pipe(filter((result) => !!result && (result.refresh || result.saved))).subscribe({
      next: () => {
        this.actions.getResourceMetadata(this.resourceId, this.resourceType());
        this.toastService.showSuccess('project.metadata.contributors.updateSucceed');
      },
    });
  }

  openEditDescriptionDialog(): void {
    const dialogRef = this.dialogService.open(DescriptionDialogComponent, {
      header: this.translateService.instant('project.metadata.description.dialog.header'),
      width: '500px',
      focusOnShow: false,
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        currentMetadata: this.metadata(),
      },
    });
    dialogRef.onClose
      .pipe(
        filter((result) => !!result),
        switchMap((result) => {
          if (this.resourceId) {
            return this.actions.updateMetadata(this.resourceId, this.resourceType(), { description: result });
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.toastService.showSuccess('project.metadata.description.updated');
        },
      });
  }

  openEditResourceInformationDialog(): void {
    const currentCustomMetadata = this.customItemMetadata();
    const dialogRef = this.dialogService.open(ResourceInformationDialogComponent, {
      header: this.translateService.instant('project.metadata.resourceInformation.dialog.header'),
      width: '500px',
      focusOnShow: false,
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        customItemMetadata: currentCustomMetadata,
      },
    });
    dialogRef.onClose
      .pipe(
        filter((result) => !!result && (result.resourceTypeGeneral || result.language)),
        switchMap((result) => {
          const updatedMetadata = {
            ...currentCustomMetadata,
            ...result,
          };
          return this.actions.updateCustomItemMetadata(this.resourceId, updatedMetadata);
        })
      )
      .subscribe({
        next: () => this.toastService.showSuccess('project.metadata.resourceInformation.updated'),
      });
  }

  openEditLicenseDialog(): void {
    const dialogRef = this.dialogService.open(LicenseDialogComponent, {
      header: this.translateService.instant('project.metadata.license.dialog.header'),
      width: '600px',
      focusOnShow: false,
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        metadata: this.metadata(),
      },
    });
    dialogRef.onClose
      .pipe(
        filter((result) => !!result && result.licenseId),
        switchMap((result) => {
          return this.actions.updateResourceLicense(
            this.resourceId,
            this.resourceType(),
            result.licenseId,
            result.licenseOptions
          );
        })
      )
      .subscribe({
        next: () => this.toastService.showSuccess('project.metadata.license.updated'),
      });
  }

  openEditFundingDialog(): void {
    const currentCustomMetadata = this.customItemMetadata();

    const dialogRef = this.dialogService.open(FundingDialogComponent, {
      header: this.translateService.instant('project.metadata.funding.dialog.header'),
      width: '600px',
      focusOnShow: false,
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        funders: currentCustomMetadata?.funders || [],
      },
    });
    dialogRef.onClose
      .pipe(
        filter((result) => !!result && result.fundingEntries),
        switchMap((result) => {
          const updatedMetadata = {
            ...currentCustomMetadata,
            funders: result.fundingEntries,
          };
          return this.actions.updateCustomItemMetadata(this.resourceId, updatedMetadata);
        })
      )
      .subscribe({
        next: () => this.toastService.showSuccess('project.metadata.funding.updated'),
      });
  }

  openEditAffiliatedInstitutionsDialog(): void {
    // const dialogRef = this.dialogService.open(AffiliatedInstitutionsDialogComponent, {
    //   header: this.translateService.instant('project.metadata.affiliatedInstitutions.dialog.header'),
    //   width: '500px',
    //   focusOnShow: false,
    //   closeOnEscape: true,
    //   modal: true,
    //   closable: true,
    //   data: {
    //     currentProject: this.currentProject(),
    //   },
    // });
    // dialogRef.onClose
    //   .pipe(
    //     filter((result) => !!result),
    //     switchMap((result) => {
    //       const projectId = this.currentProject()?.id;
    //       if (projectId) {
    //         return this.actions.updateProjectDetails(projectId, {
    //           institutions: result,
    //         });
    //       }
    //       return EMPTY;
    //     })
    //   )
    //   .subscribe({
    //     next: () => this.toastService.showSuccess('project.metadata.affiliatedInstitutions.updated'),
    //   });
  }

  getSubjectChildren(parentId: string) {
    this.actions.fetchChildrenSubjects(parentId);
  }

  searchSubjects(search: string) {
    this.actions.fetchSubjects(this.resourceType(), this.provider, search);
  }

  updateSelectedSubjects(subjects: SubjectModel[]) {
    this.actions.updateResourceSubjects(this.resourceId, this.resourceType(), subjects);
  }

  handleEditDoi(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: this.translateService.instant('project.metadata.doi.dialog.createConfirm.header'),
      messageKey: this.translateService.instant('project.metadata.doi.dialog.createConfirm.message'),
      acceptLabelKey: this.translateService.instant('common.buttons.create'),
      acceptLabelType: 'primary',
      onConfirm: () => {
        this.actions.updateMetadata(this.resourceId, this.resourceType(), { doi: true }).subscribe({
          next: () => this.toastService.showSuccess('project.metadata.doi.created'),
        });
      },
    });
  }

  private loadCedarRecord(recordId: string): void {
    // const records = this.cedarRecords();
    // const templates = this.cedarTemplates();
    // if (!records) {
    //   return;
    // }
    // const record = records.find((r) => r.id === recordId);
    // if (!record) {
    //   return;
    // }
    // this.selectedCedarRecord.set(record);
    // this.cedarFormReadonly.set(true);
    // const templateId = record.relationships?.template?.data?.id;
    // if (templateId && templates?.data) {
    //   const template = templates.data.find((t) => t.id === templateId);
    //   if (template) {
    //     this.selectedCedarTemplate.set(template);
    //   } else {
    //     this.selectedCedarTemplate.set(null);
    //     this.actions.getCedarTemplates();
    //   }
    // } else {
    //   this.selectedCedarTemplate.set(null);
    //   this.actions.getCedarTemplates();
    // }
  }

  private handleRouteBasedTabSelection(): void {
    const recordId = this.activeRoute.snapshot.paramMap.get('recordId');

    if (!recordId) {
      this.selectedTab.set('project');
      this.selectedCedarRecord.set(null);
      this.selectedCedarTemplate.set(null);
      return;
    }

    const tab = this.tabs().find((tab) => tab.id === recordId);

    if (tab) {
      this.selectedTab.set(tab.id);

      if (tab.type === 'cedar') {
        this.loadCedarRecord(tab.id);
      }
    }
  }

  private refreshContributorsData(): void {
    this.actions.getContributors(this.resourceId, this.resourceType());
  }
}
