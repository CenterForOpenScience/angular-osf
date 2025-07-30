import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { EMPTY, filter, switchMap } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
  CustomItemMetadataRecord,
} from '@osf/features/project/metadata/models';
import { ProjectOverview } from '@osf/features/project/overview/models';
import { CedarFormMapper } from '@osf/features/registry/mappers';
import {
  ContributorsSelectors,
  FetchChildrenSubjects,
  FetchSelectedSubjects,
  FetchSubjects,
  GetAllContributors,
  SubjectsSelectors,
} from '@osf/shared/stores';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';
import { CedarTemplateFormComponent } from '@shared/components/shared-metadata/components';
import {
  AffiliatedInstitutionsDialogComponent,
  ContributorsDialogComponent,
  DescriptionDialogComponent,
  FundingDialogComponent,
  ResourceInformationDialogComponent,
} from '@shared/components/shared-metadata/dialogs';
import { SharedMetadataComponent } from '@shared/components/shared-metadata/shared-metadata.component';
import { MetadataProjectsEnum, ResourceType } from '@shared/enums';
import { SubjectModel } from '@shared/models';
import { MetadataTabsModel } from '@shared/models/metadata-tabs.model';
import { ToastService } from '@shared/services';

import {
  AddRegistryContributor,
  CreateCedarMetadataRecord,
  GetBibliographicContributors,
  GetCedarMetadataTemplates,
  GetCustomItemMetadata,
  GetRegistryCedarMetadataRecords,
  GetRegistryForMetadata,
  GetRegistryInstitutions,
  GetRegistrySubjects,
  GetUserInstitutions,
  RegistryMetadataSelectors,
  UpdateCedarMetadataRecord,
  UpdateCustomItemMetadata,
  UpdateRegistryContributor,
  UpdateRegistryDetails,
  UpdateRegistryInstitutions,
  UpdateRegistrySubjects,
} from '../../store/registry-metadata';

@Component({
  selector: 'osf-registry-metadata',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    LoadingSpinnerComponent,
    SharedMetadataComponent,
    CedarTemplateFormComponent,
  ],
  templateUrl: './registry-metadata.component.html',
  styleUrl: './registry-metadata.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryMetadataComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly toastService = inject(ToastService);

  private registryId = '';

  tabs = signal<MetadataTabsModel[]>([]);
  protected readonly selectedTab = signal('registry');

  selectedCedarRecord = signal<CedarMetadataRecordData | null>(null);
  selectedCedarTemplate = signal<CedarMetadataDataTemplateJsonApi | null>(null);
  cedarFormReadonly = signal<boolean>(true);

  protected actions = createDispatchMap({
    getRegistry: GetRegistryForMetadata,
    getBibliographicContributors: GetBibliographicContributors,
    updateRegistryDetails: UpdateRegistryDetails,
    getCustomItemMetadata: GetCustomItemMetadata,
    updateCustomItemMetadata: UpdateCustomItemMetadata,
    getContributors: GetAllContributors,
    getUserInstitutions: GetUserInstitutions,
    getRegistryInstitutions: GetRegistryInstitutions,
    getRegistrySubjects: GetRegistrySubjects,
    getCedarRecords: GetRegistryCedarMetadataRecords,
    getCedarTemplates: GetCedarMetadataTemplates,
    createCedarRecord: CreateCedarMetadataRecord,
    updateCedarRecord: UpdateCedarMetadataRecord,
    addRegistryContributor: AddRegistryContributor,

    fetchSubjects: FetchSubjects,
    fetchSelectedSubjects: FetchSelectedSubjects,
    fetchChildrenSubjects: FetchChildrenSubjects,
    updateRegistrySubjects: UpdateRegistrySubjects,
    updateRegistryInstitutions: UpdateRegistryInstitutions,
    updateRegistryContributor: UpdateRegistryContributor,
  });

  protected currentRegistry = select(RegistryMetadataSelectors.getRegistry);
  protected currentRegistryLoading = select(RegistryMetadataSelectors.getRegistryLoading);
  protected customItemMetadata = select(RegistryMetadataSelectors.getCustomItemMetadata);
  protected currentUser = select(UserSelectors.getCurrentUser);
  protected contributors = select(ContributorsSelectors.getContributors);
  protected isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  protected institutions = select(RegistryMetadataSelectors.getInstitutions);
  protected selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  protected isSubjectsUpdating = select(SubjectsSelectors.areSelectedSubjectsLoading);
  protected cedarRecords = select(RegistryMetadataSelectors.getCedarRecords);
  protected cedarTemplates = select(RegistryMetadataSelectors.getCedarTemplates);

  protected readonly isReadonly = computed(() => {
    const registry = this.currentRegistry();
    if (!registry) return false;

    const permissions = registry.currentUserPermissions || [];
    return permissions.length === 1 && permissions[0] === 'read';
  });

  constructor() {
    effect(() => {
      const records = this.cedarRecords();
      const registry = this.currentRegistry();
      if (!registry) return;

      const baseTabs = [{ id: 'registry', label: registry.title, type: MetadataProjectsEnum.REGISTRY }];

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
    this.registryId = this.route.parent?.parent?.snapshot.params['id'];

    if (this.registryId) {
      this.actions.getRegistry(this.registryId);
      this.actions.getBibliographicContributors(this.registryId);
      this.actions.getCustomItemMetadata(this.registryId);
      this.actions.getContributors(this.registryId, ResourceType.Registration);
      this.actions.getRegistryInstitutions(this.registryId);
      this.actions.getRegistrySubjects(this.registryId);
      this.actions.getCedarRecords(this.registryId);
      this.actions.getCedarTemplates();
      this.actions.fetchSubjects(ResourceType.Registration, this.registryId, '', true);
      this.actions.fetchSelectedSubjects(this.registryId, ResourceType.Registration);

      const user = this.currentUser();
      if (user?.id) {
        this.actions.getUserInstitutions(user.id);
      }
    }
  }

  openAddRecord(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onTagsChanged(tags: string[]): void {
    const registryId = this.currentRegistry()?.id;
    if (registryId) {
      this.actions.updateRegistryDetails(registryId, { tags });
    }
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
        projectId: this.currentRegistry()?.id,
        contributors: this.contributors(),
        isLoading: this.isContributorsLoading(),
        isRegistry: true,
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
        currentProject: this.currentRegistry(),
      },
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result),
        switchMap((result) => {
          const registryId = this.currentRegistry()?.id;
          if (registryId) {
            return this.actions.updateRegistryDetails(registryId, { description: result });
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.toastService.showSuccess('project.metadata.description.updated');
          const registryId = this.currentRegistry()?.id;
          if (registryId) {
            this.actions.getRegistry(registryId);
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
        currentProject: this.currentRegistry(),
        customItemMetadata: this.customItemMetadata(),
      },
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result && (result.resourceType || result.resourceLanguage)),
        switchMap((result) => {
          const registryId = this.currentRegistry()?.id;
          if (registryId) {
            const currentMetadata = this.customItemMetadata();

            const updatedMetadata = {
              ...currentMetadata,
              language: result.resourceLanguage || currentMetadata?.language,
              resource_type_general: result.resourceType || currentMetadata?.resource_type_general,
              funders: currentMetadata?.funders,
            };

            return this.actions.updateCustomItemMetadata(registryId, updatedMetadata);
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: () => this.toastService.showSuccess('project.metadata.resourceInformation.updated'),
      });
  }

  openEditFundingDialog(): void {
    const dialogRef = this.dialogService.open(FundingDialogComponent, {
      header: this.translateService.instant('project.metadata.funding.dialog.header'),
      width: '600px',
      focusOnShow: false,
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        funders: this.customItemMetadata().funders,
      },
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result && result.fundingEntries),
        switchMap((result) => {
          const registryId = this.currentRegistry()?.id;
          if (registryId) {
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

            return this.actions.updateCustomItemMetadata(registryId, updatedMetadata);
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
        currentProject: this.getCurrentInstanceForTemplate(),
      },
    });

    dialogRef.onClose
      .pipe(
        filter((result) => !!result),
        switchMap((result) => {
          const registryId = this.currentRegistry()?.id;
          if (registryId) {
            const institutionsData = result.map((institutionId: string) => ({
              type: 'institutions',
              id: institutionId,
            }));

            return this.actions.updateRegistryInstitutions(registryId, institutionsData);
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.toastService.showSuccess('project.metadata.affiliatedInstitutions.updated');
        },
      });
  }

  getSubjectChildren(parentId: string) {
    this.actions.fetchChildrenSubjects(parentId);
  }

  searchSubjects(search: string) {
    this.actions.fetchSubjects(ResourceType.Registration, this.registryId, search, true);
  }

  updateSelectedSubjects(subjects: SubjectModel[]) {
    const subjectData = subjects.map((subject) => ({
      type: 'subjects',
      id: subject.id,
    }));
    this.actions.updateRegistrySubjects(this.registryId, subjectData);
  }

  getCurrentInstanceForTemplate(): ProjectOverview {
    const registry = this.currentRegistry();
    const institutions = this.institutions();

    const institutionsFormatted =
      institutions?.map((inst) => ({
        id: inst.id,
        name: inst.attributes.name,
      })) || [];

    return {
      ...registry,
      institutions: institutionsFormatted,
    } as unknown as ProjectOverview;
  }

  getCustomMetadataForTemplate(): CustomItemMetadataRecord {
    return this.customItemMetadata() as unknown as CustomItemMetadataRecord;
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
    const registryId = this.currentRegistry()?.id;
    const selectedRecord = this.selectedCedarRecord();

    if (!registryId || !selectedRecord) return;

    const model = CedarFormMapper(data, registryId);

    if (selectedRecord.id) {
      this.actions
        .updateCedarRecord(model, selectedRecord.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.cedarFormReadonly.set(true);
            this.toastService.showSuccess('CEDAR record updated successfully');
            this.actions.getCedarRecords(registryId);
          },
        });
    }
  }

  onCedarFormChangeTemplate(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
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
      this.selectedTab.set('registry');
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
    this.actions.getContributors(this.registryId, ResourceType.Registration);
  }
}
