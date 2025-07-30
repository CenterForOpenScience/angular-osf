import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { EMPTY, filter, switchMap } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
} from '@osf/features/project/metadata/models';
import {
  CreateCedarMetadataRecord,
  GetCedarMetadataRecords,
  GetCedarMetadataTemplates,
  GetCustomItemMetadata,
  GetFundersList,
  GetProjectForMetadata,
  GetUserInstitutions,
  ProjectMetadataSelectors,
  UpdateCedarMetadataRecord,
  UpdateCustomItemMetadata,
  UpdateProjectDetails,
} from '@osf/features/project/metadata/store';
import { MetadataProjectsEnum, ResourceType } from '@osf/shared/enums';
import {
  ContributorsSelectors,
  FetchChildrenSubjects,
  FetchSelectedSubjects,
  FetchSubjects,
  GetAllContributors,
  SubjectsSelectors,
  UpdateResourceSubjects,
} from '@osf/shared/stores';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';
import { CedarTemplateFormComponent } from '@shared/components/shared-metadata/components';
import {
  AffiliatedInstitutionsDialogComponent,
  ContributorsDialogComponent,
  DescriptionDialogComponent,
  FundingDialogComponent,
  LicenseDialogComponent,
  ResourceInformationDialogComponent,
} from '@shared/components/shared-metadata/dialogs';
import { SharedMetadataComponent } from '@shared/components/shared-metadata/shared-metadata.component';
import { SubjectModel } from '@shared/models';
import { MetadataTabsModel } from '@shared/models/metadata-tabs.model';
import { CustomConfirmationService, LoaderService, ToastService } from '@shared/services';

@Component({
  selector: 'osf-project-metadata',
  imports: [
    SubHeaderComponent,
    CedarTemplateFormComponent,
    TranslatePipe,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    LoadingSpinnerComponent,
    SharedMetadataComponent,
  ],
  templateUrl: './project-metadata.component.html',
  styleUrl: './project-metadata.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly toastService = inject(ToastService);
  private readonly loaderService = inject(LoaderService);
  private readonly customConfirmationService = inject(CustomConfirmationService);

  private projectId = '';

  tabs = signal<MetadataTabsModel[]>([]);
  protected readonly selectedTab = signal('project');

  selectedCedarRecord = signal<CedarMetadataRecordData | null>(null);
  selectedCedarTemplate = signal<CedarMetadataDataTemplateJsonApi | null>(null);
  cedarFormReadonly = signal<boolean>(true);

  protected actions = createDispatchMap({
    getProject: GetProjectForMetadata,
    updateProjectDetails: UpdateProjectDetails,
    getCustomItemMetadata: GetCustomItemMetadata,
    updateCustomItemMetadata: UpdateCustomItemMetadata,
    getFundersList: GetFundersList,
    getContributors: GetAllContributors,
    getUserInstitutions: GetUserInstitutions,
    getCedarRecords: GetCedarMetadataRecords,
    getCedarTemplates: GetCedarMetadataTemplates,
    createCedarRecord: CreateCedarMetadataRecord,
    updateCedarRecord: UpdateCedarMetadataRecord,

    fetchSubjects: FetchSubjects,
    fetchSelectedSubjects: FetchSelectedSubjects,
    fetchChildrenSubjects: FetchChildrenSubjects,
    updateResourceSubjects: UpdateResourceSubjects,
  });

  protected currentProject = select(ProjectMetadataSelectors.getProject);
  protected currentProjectLoading = select(ProjectMetadataSelectors.getProjectLoading);
  protected customItemMetadata = select(ProjectMetadataSelectors.getCustomItemMetadata);
  protected fundersList = select(ProjectMetadataSelectors.getFundersList);
  protected contributors = select(ContributorsSelectors.getContributors);
  protected isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  protected currentUser = select(UserSelectors.getCurrentUser);
  protected cedarRecords = select(ProjectMetadataSelectors.getCedarRecords);
  protected cedarTemplates = select(ProjectMetadataSelectors.getCedarTemplates);
  protected selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  protected isSubjectsUpdating = select(SubjectsSelectors.areSelectedSubjectsLoading);

  constructor() {
    effect(() => {
      const records = this.cedarRecords();
      const project = this.currentProject();
      if (!project) return;

      const baseTabs = [{ id: 'project', label: project.title, type: MetadataProjectsEnum.PROJECT }];

      const cedarTabs =
        records?.map((record) => ({
          id: record.id || '',
          label: record.embeds?.template?.data?.attributes?.schema_name || `Record ${record.id}`,
          type: MetadataProjectsEnum.CEDAR,
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
  }

  ngOnInit(): void {
    this.projectId = this.route.parent?.parent?.snapshot.params['id'];

    if (this.projectId) {
      this.actions.getProject(this.projectId);
      this.actions.getCustomItemMetadata(this.projectId);
      this.actions.getContributors(this.projectId, ResourceType.Project);
      this.actions.getCedarRecords(this.projectId);
      this.actions.getCedarTemplates();
      this.actions.fetchSubjects(ResourceType.Project);
      this.actions.fetchSelectedSubjects(this.projectId!, ResourceType.Project);

      const user = this.currentUser();
      if (user?.id) {
        this.actions.getUserInstitutions(user.id);
      }
    }
  }

  onTagsChanged(tags: string[]): void {
    const projectId = this.currentProject()?.id;
    if (projectId) {
      this.actions.updateProjectDetails(projectId, { tags });
    }
  }

  openAddRecord(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
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
        projectId: this.currentProject()?.id,
        contributors: this.contributors(),
        isLoading: this.isContributorsLoading(),
      },
    });

    dialogRef.onClose.pipe(filter((result) => !!result && (result.refresh || result.saved))).subscribe({
      next: () => {
        this.refreshContributorsData();
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
        currentProject: this.currentProject(),
      },
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result),
        switchMap((result) => {
          const projectId = this.currentProject()?.id;
          if (projectId) {
            return this.actions.updateProjectDetails(projectId, { description: result });
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.toastService.showSuccess('project.metadata.description.updated');
          const projectId = this.currentProject()?.id;
          if (projectId) {
            this.actions.getProject(projectId);
          }
        },
      });
  }

  openEditResourceInformationDialog(): void {
    const dialogRef = this.dialogService.open(ResourceInformationDialogComponent, {
      header: this.translateService.instant('project.metadata.resourceInformation.dialog.header'),
      width: '500px',
      focusOnShow: false,
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        currentProject: this.currentProject(),
        customItemMetadata: this.customItemMetadata(),
      },
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result && (result.resourceType || result.resourceLanguage)),
        switchMap((result) => {
          const projectId = this.currentProject()?.id;
          if (projectId) {
            const currentMetadata = this.customItemMetadata();

            const updatedMetadata = {
              ...currentMetadata,
              language: result.resourceLanguage || currentMetadata?.language,
              resource_type_general: result.resourceType || currentMetadata?.resource_type_general,
              funder: currentMetadata?.funders,
            };

            return this.actions.updateCustomItemMetadata(projectId, updatedMetadata);
          }
          return EMPTY;
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
        currentProject: this.currentProject(),
      },
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result && result.licenseName && result.licenseId),
        switchMap((result) => {
          const projectId = this.currentProject()?.id;
          if (projectId) {
            return this.actions.updateProjectDetails(projectId, {
              node_license: {
                id: result.licenseId,
                type: 'node-license',
              },
            });
          }

          return EMPTY;
        })
      )
      .subscribe({
        next: () => this.toastService.showSuccess('project.metadata.license.updated'),
      });
  }

  openEditFundingDialog(): void {
    this.actions.getFundersList();

    const dialogRef = this.dialogService.open(FundingDialogComponent, {
      header: this.translateService.instant('project.metadata.funding.dialog.header'),
      width: '600px',
      focusOnShow: false,
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        currentProject: this.currentProject(),
      },
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result && result.fundingEntries),
        switchMap((result) => {
          const projectId = this.currentProject()?.id;
          if (projectId) {
            const currentMetadata = this.customItemMetadata() || {
              language: 'en',
              resource_type_general: 'Dataset',
              funders: [],
            };

            const updatedMetadata = {
              ...currentMetadata,
              funders: result.fundingEntries.map(
                (entry: {
                  funderName?: string;
                  funderIdentifier?: string;
                  funderIdentifierType?: string;
                  awardNumber?: string;
                  awardUri?: string;
                  awardTitle?: string;
                }) => ({
                  funder_name: entry.funderName || '',
                  funder_identifier: entry.funderIdentifier || '',
                  funder_identifier_type: entry.funderIdentifierType || '',
                  award_number: entry.awardNumber || '',
                  award_uri: entry.awardUri || '',
                  award_title: entry.awardTitle || '',
                })
              ),
            };

            return this.actions.updateCustomItemMetadata(projectId, updatedMetadata);
          }

          return EMPTY;
        })
      )
      .subscribe({
        next: () => this.toastService.showSuccess('project.metadata.funding.updated'),
      });
  }

  openEditAffiliatedInstitutionsDialog(): void {
    const dialogRef = this.dialogService.open(AffiliatedInstitutionsDialogComponent, {
      header: this.translateService.instant('project.metadata.affiliatedInstitutions.dialog.header'),
      width: '500px',
      focusOnShow: false,
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        currentProject: this.currentProject(),
      },
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result),
        switchMap((result) => {
          const projectId = this.currentProject()?.id;
          if (projectId) {
            return this.actions.updateProjectDetails(projectId, {
              institutions: result,
            });
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: () => this.toastService.showSuccess('project.metadata.affiliatedInstitutions.updated'),
      });
  }

  handleEditDoi(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: this.translateService.instant('project.metadata.doi.dialog.createConfirm.header'),
      messageKey: this.translateService.instant('project.metadata.doi.dialog.createConfirm.message'),
      acceptLabelKey: this.translateService.instant('common.buttons.create'),
      acceptLabelType: 'primary',
      onConfirm: () => {
        const projectId = this.currentProject()?.id;
        if (projectId) {
          this.actions.updateProjectDetails(projectId, { doi: true }).subscribe({
            next: () => this.toastService.showSuccess('project.metadata.doi.created'),
          });
        }
      },
    });
  }

  onTabChange(tabId: string | number): void {
    const tab = this.tabs().find((x) => x.id === tabId.toString());

    if (!tab) {
      return;
    }

    this.selectedTab.set(tab.id);

    if (tab.type === 'cedar') {
      this.loadCedarRecord(tab.id);

      const currentRecordId = this.route.snapshot.paramMap.get('recordId');
      if (currentRecordId !== tab.id) {
        this.router.navigate(['metadata', tab.id], { relativeTo: this.route.parent?.parent });
      }
    } else {
      this.selectedCedarRecord.set(null);
      this.selectedCedarTemplate.set(null);

      const currentRecordId = this.route.snapshot.paramMap.get('recordId');
      if (currentRecordId) {
        this.router.navigate(['metadata'], { relativeTo: this.route.parent?.parent });
      }
    }
  }

  onCedarFormEdit(): void {
    this.cedarFormReadonly.set(false);
  }

  onCedarFormSubmit(data: CedarRecordDataBinding): void {
    const projectId = this.currentProject()?.id;
    const selectedRecord = this.selectedCedarRecord();

    if (!projectId || !selectedRecord) return;

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
              id: projectId,
            },
          },
        },
      },
    } as CedarMetadataRecord;

    if (selectedRecord.id) {
      this.actions
        .updateCedarRecord(model, selectedRecord.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.cedarFormReadonly.set(true);
            this.toastService.showSuccess('CEDAR record updated successfully');
            this.actions.getCedarRecords(projectId);
          },
        });
    }
  }

  onCedarFormChangeTemplate(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  getSubjectChildren(parentId: string) {
    this.actions.fetchChildrenSubjects(parentId);
  }

  searchSubjects(search: string) {
    this.actions.fetchSubjects(ResourceType.Project, this.projectId, search);
  }

  updateSelectedSubjects(subjects: SubjectModel[]) {
    this.actions.updateResourceSubjects(this.projectId, ResourceType.Project, subjects);
  }

  private refreshContributorsData(): void {
    if (this.projectId) {
      this.actions.getContributors(this.projectId, ResourceType.Project);
    }
  }

  private loadCedarRecord(recordId: string): void {
    const records = this.cedarRecords();
    const templates = this.cedarTemplates();

    if (!records) {
      return;
    }

    const record = records.find((r) => r.id === recordId);
    if (!record) {
      return;
    }

    this.selectedCedarRecord.set(record);
    this.cedarFormReadonly.set(true);

    const templateId = record.relationships?.template?.data?.id;
    if (templateId && templates?.data) {
      const template = templates.data.find((t) => t.id === templateId);
      if (template) {
        this.selectedCedarTemplate.set(template);
      } else {
        this.selectedCedarTemplate.set(null);
        this.actions.getCedarTemplates();
      }
    } else {
      this.selectedCedarTemplate.set(null);
      this.actions.getCedarTemplates();
    }
  }

  private handleRouteBasedTabSelection(): void {
    const recordId = this.route.snapshot.paramMap.get('recordId');

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
}
