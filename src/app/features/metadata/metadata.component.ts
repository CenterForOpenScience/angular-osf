import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MetadataTabsComponent, SubHeaderComponent } from '@osf/shared/components';
import { CedarTemplateFormComponent } from '@osf/shared/components/shared-metadata/components';
import { SharedMetadataComponent } from '@osf/shared/components/shared-metadata/shared-metadata.component';
import { MetadataResourceEnum, ResourceType } from '@osf/shared/enums';
import { MetadataTabsModel, SubjectModel } from '@osf/shared/models';
import { CustomConfirmationService, ToastService } from '@osf/shared/services';
import { ContributorsSelectors, SubjectsSelectors } from '@osf/shared/stores';

import { MetadataSelectors } from './store/metadata.selectors';
import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
} from './models';

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
  protected readonly selectedTab = signal('osf');

  selectedCedarRecord = signal<CedarMetadataRecordData | null>(null);
  selectedCedarTemplate = signal<CedarMetadataDataTemplateJsonApi | null>(null);
  cedarFormReadonly = signal<boolean>(true);
  protected currentProject = select(MetadataSelectors.getProject);
  protected currentProjectLoading = select(MetadataSelectors.getProjectLoading);
  protected customItemMetadata = select(MetadataSelectors.getCustomItemMetadata);
  protected fundersList = select(MetadataSelectors.getFundersList);
  protected contributors = select(ContributorsSelectors.getContributors);
  protected isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  protected cedarRecords = select(MetadataSelectors.getCedarRecords);
  protected cedarTemplates = select(MetadataSelectors.getCedarTemplates);
  protected selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  protected isSubjectsUpdating = select(SubjectsSelectors.areSelectedSubjectsLoading);
  resourceType = signal<ResourceType>(
    this.activeRoute.parent?.parent?.snapshot.data['resourceType'] || ResourceType.Project
  );

  ngOnInit(): void {
    this.resourceId = this.activeRoute.parent?.parent?.snapshot.params['id'];

    if (this.resourceId) {
      // this.actions.getProject(this.resourceId);
      // this.actions.getCustomItemMetadata(this.resourceId);
      // this.actions.getContributors(this.resourceId, ResourceType.Project);
      // this.actions.getCedarRecords(this.resourceId);
      // this.actions.getCedarTemplates();
      // this.actions.fetchSubjects(ResourceType.Project);
      // this.actions.fetchSelectedSubjects(this.resourceId!, ResourceType.Project);
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
    // const projectId = this.currentProject()?.id;
    // if (projectId) {
    //   this.actions.updateProjectDetails(projectId, { tags });
    // }
  }

  openEditContributorDialog(): void {
    // const dialogRef = this.dialogService.open(ContributorsDialogComponent, {
    //   width: '800px',
    //   header: this.translateService.instant('project.metadata.contributors.editContributors'),
    //   focusOnShow: false,
    //   closeOnEscape: true,
    //   modal: true,
    //   closable: true,
    //   data: {
    //     projectId: this.currentProject()?.id,
    //     contributors: this.contributors(),
    //     isLoading: this.isContributorsLoading(),
    //   },
    // });
    // dialogRef.onClose.pipe(filter((result) => !!result && (result.refresh || result.saved))).subscribe({
    //   next: () => {
    //     this.refreshContributorsData();
    //     this.toastService.showSuccess('project.metadata.contributors.updateSucceed');
    //   },
    // });
  }

  openEditDescriptionDialog(): void {
    // const dialogRef = this.dialogService.open(DescriptionDialogComponent, {
    //   header: this.translateService.instant('project.metadata.description.dialog.header'),
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
    //         return this.actions.updateProjectDetails(projectId, { description: result });
    //       }
    //       return EMPTY;
    //     })
    //   )
    //   .subscribe({
    //     next: () => {
    //       this.toastService.showSuccess('project.metadata.description.updated');
    //       const projectId = this.currentProject()?.id;
    //       if (projectId) {
    //         this.actions.getProject(projectId);
    //       }
    //     },
    //   });
  }

  openEditResourceInformationDialog(): void {
    // const dialogRef = this.dialogService.open(ResourceInformationDialogComponent, {
    //   header: this.translateService.instant('project.metadata.resourceInformation.dialog.header'),
    //   width: '500px',
    //   focusOnShow: false,
    //   closeOnEscape: true,
    //   modal: true,
    //   closable: true,
    //   data: {
    //     currentProject: this.currentProject(),
    //     customItemMetadata: this.customItemMetadata(),
    //   },
    // });
    // dialogRef.onClose
    //   .pipe(
    //     filter((result) => !!result && (result.resourceType || result.resourceLanguage)),
    //     switchMap((result) => {
    //       const projectId = this.currentProject()?.id;
    //       if (projectId) {
    //         const currentMetadata = this.customItemMetadata();
    //         const updatedMetadata = {
    //           ...currentMetadata,
    //           language: result.resourceLanguage || currentMetadata?.language,
    //           resource_type_general: result.resourceType || currentMetadata?.resource_type_general,
    //           funder: currentMetadata?.funders,
    //         };
    //         return this.actions.updateCustomItemMetadata(projectId, updatedMetadata);
    //       }
    //       return EMPTY;
    //     })
    //   )
    //   .subscribe({
    //     next: () => this.toastService.showSuccess('project.metadata.resourceInformation.updated'),
    //   });
  }

  openEditLicenseDialog(): void {
    // const dialogRef = this.dialogService.open(LicenseDialogComponent, {
    //   header: this.translateService.instant('project.metadata.license.dialog.header'),
    //   width: '600px',
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
    //     filter((result) => !!result && result.licenseName && result.licenseId),
    //     switchMap((result) => {
    //       const projectId = this.currentProject()?.id;
    //       if (projectId) {
    //         return this.actions.updateProjectDetails(projectId, {
    //           node_license: {
    //             id: result.licenseId,
    //             type: 'node-license',
    //           },
    //         });
    //       }
    //       return EMPTY;
    //     })
    //   )
    //   .subscribe({
    //     next: () => this.toastService.showSuccess('project.metadata.license.updated'),
    //   });
  }

  openEditFundingDialog(): void {
    // this.actions.getFundersList();
    // const dialogRef = this.dialogService.open(FundingDialogComponent, {
    //   header: this.translateService.instant('project.metadata.funding.dialog.header'),
    //   width: '600px',
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
    //     filter((result) => !!result && result.fundingEntries),
    //     switchMap((result) => {
    //       const projectId = this.currentProject()?.id;
    //       if (projectId) {
    //         const currentMetadata = this.customItemMetadata() || {
    //           language: 'en',
    //           resource_type_general: 'Dataset',
    //           funders: [],
    //         };
    //         const updatedMetadata = {
    //           ...currentMetadata,
    //           funders: result.fundingEntries.map(
    //             (entry: {
    //               funderName?: string;
    //               funderIdentifier?: string;
    //               funderIdentifierType?: string;
    //               awardNumber?: string;
    //               awardUri?: string;
    //               awardTitle?: string;
    //             }) => ({
    //               funder_name: entry.funderName || '',
    //               funder_identifier: entry.funderIdentifier || '',
    //               funder_identifier_type: entry.funderIdentifierType || '',
    //               award_number: entry.awardNumber || '',
    //               award_uri: entry.awardUri || '',
    //               award_title: entry.awardTitle || '',
    //             })
    //           ),
    //         };
    //         return this.actions.updateCustomItemMetadata(projectId, updatedMetadata);
    //       }
    //       return EMPTY;
    //     })
    //   )
    //   .subscribe({
    //     next: () => this.toastService.showSuccess('project.metadata.funding.updated'),
    //   });
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
    // this.actions.fetchChildrenSubjects(parentId);
  }

  searchSubjects(search: string) {
    // this.actions.fetchSubjects(ResourceType.Project, this.projectId, search);
  }

  updateSelectedSubjects(subjects: SubjectModel[]) {
    // this.actions.updateResourceSubjects(this.projectId, ResourceType.Project, subjects);
  }

  handleEditDoi(): void {
    // this.customConfirmationService.confirmDelete({
    //   headerKey: this.translateService.instant('project.metadata.doi.dialog.createConfirm.header'),
    //   messageKey: this.translateService.instant('project.metadata.doi.dialog.createConfirm.message'),
    //   acceptLabelKey: this.translateService.instant('common.buttons.create'),
    //   acceptLabelType: 'primary',
    //   onConfirm: () => {
    //     const projectId = this.currentProject()?.id;
    //     if (projectId) {
    //       this.actions.updateProjectDetails(projectId, { doi: true }).subscribe({
    //         next: () => this.toastService.showSuccess('project.metadata.doi.created'),
    //       });
    //     }
    //   },
    // });
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
}
