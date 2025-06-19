import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { TabPanel, TabView } from 'primeng/tabview';

import { EMPTY, filter, switchMap } from 'rxjs';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
// Import contributors functionality
import { ContributorsSelectors, GetAllContributors } from '@osf/features/project/contributors/store';
import {
  ProjectMetadataAffiliatedInstitutionsComponent,
  ProjectMetadataContributorsComponent,
  ProjectMetadataDescriptionComponent,
  ProjectMetadataFundingComponent,
  ProjectMetadataLicenseComponent,
  ProjectMetadataPublicationDoiComponent,
  ProjectMetadataResourceInformationComponent,
  ProjectMetadataSubjectsComponent,
  ProjectMetadataTagsComponent,
} from '@osf/features/project/metadata/components';
import {
  AffiliatedInstitutionsDialogComponent,
  ContributorsDialogComponent,
  DescriptionDialogComponent,
  DoiDialogComponent,
  FundingDialogComponent,
  LicenseDialogComponent,
  ResourceInformationDialogComponent,
} from '@osf/features/project/metadata/dialogs';
import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecord,
  CedarMetadataRecordData,
} from '@osf/features/project/metadata/models';
import { CedarTemplateFormComponent } from '@osf/features/project/metadata/pages/add-metadata/components';
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
import { ProjectOverviewSubject } from '@osf/features/project/overview/models';
import { SubHeaderComponent } from '@shared/components';
import { ToastService } from '@shared/services';
import { GetSubjects, SubjectsSelectors, UpdateProjectSubjects } from '@shared/stores';

@Component({
  selector: 'osf-project-metadata',
  imports: [
    SubHeaderComponent,
    Card,
    DatePipe,

    ProjectMetadataContributorsComponent,
    ProjectMetadataDescriptionComponent,
    ProjectMetadataResourceInformationComponent,
    ProjectMetadataLicenseComponent,
    ProjectMetadataPublicationDoiComponent,
    ProjectMetadataTagsComponent,
    ProjectMetadataSubjectsComponent,
    ProjectMetadataFundingComponent,
    ProjectMetadataAffiliatedInstitutionsComponent,
    CedarTemplateFormComponent,
    TranslatePipe,
    TabView,
    TabPanel,
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
  private readonly store = inject(Store);
  private readonly toastService = inject(ToastService);

  activeTabIndex = signal<number>(0);
  tabs = signal<{ id: string; label: string; type: 'project' | 'cedar' }[]>([]);

  selectedCedarRecord = signal<CedarMetadataRecordData | null>(null);
  selectedCedarTemplate = signal<CedarMetadataDataTemplateJsonApi | null>(null);
  cedarFormReadonly = signal<boolean>(true);

  protected actions = createDispatchMap({
    getProject: GetProjectForMetadata,
    updateProjectDetails: UpdateProjectDetails,
    updateProjectSubjects: UpdateProjectSubjects,
    getCustomItemMetadata: GetCustomItemMetadata,
    updateCustomItemMetadata: UpdateCustomItemMetadata,
    getFundersList: GetFundersList,
    getContributors: GetAllContributors,
    getUserInstitutions: GetUserInstitutions,
    getHighlightedSubjects: GetSubjects,
    getCedarRecords: GetCedarMetadataRecords,
    getCedarTemplates: GetCedarMetadataTemplates,
    createCedarRecord: CreateCedarMetadataRecord,
    updateCedarRecord: UpdateCedarMetadataRecord,
  });

  protected currentProject = select(ProjectMetadataSelectors.getProject);
  protected customItemMetadata = select(ProjectMetadataSelectors.getCustomItemMetadata);
  protected fundersList = select(ProjectMetadataSelectors.getFundersList);
  protected contributors = select(ContributorsSelectors.getContributors);
  protected isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  protected highlightedSubjects = select(SubjectsSelectors.getHighlightedSubjects);
  protected highlightedSubjectsLoading = select(SubjectsSelectors.getHighlightedSubjectsLoading);
  protected currentUser = select(UserSelectors.getCurrentUser);
  protected cedarRecords = select(ProjectMetadataSelectors.getCedarRecords);
  protected cedarTemplates = select(ProjectMetadataSelectors.getCedarTemplates);

  constructor() {
    effect(() => {
      const records = this.cedarRecords();
      const project = this.currentProject();
      if (!project) return;

      const baseTabs = [{ id: 'project', label: project.title, type: 'project' as const }];

      const cedarTabs = records.map((record) => ({
        id: record.id || '',
        label: record.embeds?.template?.data?.attributes?.schema_name || `Record ${record.id}`,
        type: 'cedar' as const,
      }));

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
    const projectId = this.route.parent?.parent?.snapshot.params['id'];

    if (projectId) {
      this.actions.getProject(projectId);
      this.actions.getCustomItemMetadata(projectId);
      this.actions.getContributors(projectId);
      this.actions.getHighlightedSubjects();
      this.actions.getCedarRecords(projectId);
      this.actions.getCedarTemplates();

      const user = this.currentUser();
      if (user?.id) {
        this.actions.getUserInstitutions(user.id);
      }
    }

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.handleRouteBasedTabSelection();
    });
  }

  private handleRouteBasedTabSelection(): void {
    const recordId = this.route.snapshot.paramMap.get('recordId');

    if (!recordId) {
      this.activeTabIndex.set(0);
      this.selectedCedarRecord.set(null);
      this.selectedCedarTemplate.set(null);
      return;
    }

    const tabs = this.tabs();
    const index = tabs.findIndex((tab) => tab.id === recordId);

    if (index >= 0) {
      this.activeTabIndex.set(index);
      const tab = tabs[index];
      if (tab.type === 'cedar') {
        this.loadCedarRecord(tab.id);
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

  onSubjectsChanged(subjects: ProjectOverviewSubject[]): void {
    const projectId = this.currentProject()?.id;
    if (projectId) {
      const subjectIds = subjects.map((subject) => subject.id);
      this.actions.updateProjectSubjects(projectId, subjectIds);
    }
  }

  openEditContributorDialog(): void {
    const dialogRef = this.dialogService.open(ContributorsDialogComponent, {
      header: this.translateService.instant('project.metadata.contributors.dialog.header'),
      width: '800px',
      data: {
        projectId: this.currentProject()?.id,
        contributors: this.contributors(),
        isLoading: this.isContributorsLoading(),
      },
    });

    dialogRef.onClose.pipe(filter((result) => !!result)).subscribe({
      next: (result) => {
        if (result.refresh || result.saved) {
          this.refreshContributorsData();
          this.toastService.showSuccess('project.metadata.contributors.updated');
        }
      },
      error: () => this.toastService.showError('project.metadata.contributors.updateFailed'),
    });
  }

  private refreshContributorsData(): void {
    const projectId = this.route.parent?.parent?.snapshot.params['id'];
    if (projectId) {
      this.actions.getContributors(projectId);
    }
  }

  openEditDescriptionDialog(): void {
    const dialogRef = this.dialogService.open(DescriptionDialogComponent, {
      header: this.translateService.instant('project.metadata.description.dialog.header'),
      width: '500px',
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
            return this.store.dispatch(
              new UpdateProjectDetails(projectId, {
                description: result,
              })
            );
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
      data: {
        currentProject: this.currentProject(),
        customItemMetadata: this.customItemMetadata(),
      },
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result),
        switchMap((result) => {
          if (result && (result.resourceType || result.resourceLanguage)) {
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
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: () => this.toastService.showSuccess('project.metadata.resourceInformation.updated'),
        error: () => this.toastService.showError('project.metadata.resourceInformation.updateFailed'),
      });
  }

  openEditLicenseDialog(): void {
    const dialogRef = this.dialogService.open(LicenseDialogComponent, {
      header: this.translateService.instant('project.metadata.license.dialog.header'),
      width: '600px',
      data: {
        currentProject: this.currentProject(),
      },
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result),
        switchMap((result) => {
          if (result && result.licenseName && result.licenseId) {
            const projectId = this.currentProject()?.id;
            if (projectId) {
              return this.store.dispatch(
                new UpdateProjectDetails(projectId, {
                  node_license: {
                    id: result.licenseId,
                    type: 'node-license',
                  },
                })
              );
            }
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
      data: {
        currentProject: this.currentProject(),
      },
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result),
        switchMap((result) => {
          if (result && result.fundingEntries) {
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
            return this.store.dispatch(
              new UpdateProjectDetails(projectId, {
                institutions: result,
              })
            );
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: () => this.toastService.showSuccess('project.metadata.affiliatedInstitutions.updated'),
      });
  }

  handleEditDoi(): void {
    const dialogRef = this.dialogService.open(DoiDialogComponent, {
      header: this.translateService.instant('project.metadata.doi.dialog.createConfirm.header'),
      width: '500px',
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result),
        switchMap((result) => {
          const projectId = this.currentProject()?.id;
          if (projectId) {
            return this.store.dispatch(
              new UpdateProjectDetails(projectId, {
                doi: result,
              })
            );
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: () => this.toastService.showSuccess('project.metadata.doi.created'),
      });
  }

  onTabChange(index: number): void {
    this.activeTabIndex.set(index);
    const tab = this.tabs()[index];

    if (tab.type === 'cedar') {
      this.loadCedarRecord(tab.id);

      const currentRecordId = this.route.snapshot.paramMap.get('recordId');
      if (currentRecordId !== tab.id) {
        this.router.navigate(['..', tab.id], { relativeTo: this.route });
      }
    } else {
      this.selectedCedarRecord.set(null);
      this.selectedCedarTemplate.set(null);

      const currentRecordId = this.route.snapshot.paramMap.get('recordId');
      if (currentRecordId) {
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    }
  }

  private loadCedarRecord(recordId: string): void {
    const records = this.cedarRecords();
    const templates = this.cedarTemplates();

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

  onCedarFormEdit(): void {
    this.cedarFormReadonly.set(false);
  }

  onCedarFormSubmit(data: { data: Record<string, unknown>; id: string }): void {
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
}
