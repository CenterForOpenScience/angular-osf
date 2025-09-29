import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { MetadataTabsComponent, SubHeaderComponent } from '@osf/shared/components';
import { MetadataResourceEnum, ResourceType, UserPermissions } from '@osf/shared/enums';
import { IS_MEDIUM } from '@osf/shared/helpers';
import { MetadataTabsModel, SubjectModel } from '@osf/shared/models';
import { CustomConfirmationService, CustomDialogService, ToastService } from '@osf/shared/services';
import {
  ContributorsSelectors,
  FetchChildrenSubjects,
  FetchResourceInstitutions,
  FetchSelectedSubjects,
  FetchSubjects,
  GetAllContributors,
  InstitutionsSelectors,
  SubjectsSelectors,
  UpdateResourceInstitutions,
  UpdateResourceSubjects,
} from '@osf/shared/stores';

import { EditTitleDialogComponent } from './dialogs/edit-title-dialog/edit-title-dialog.component';
import {
  MetadataAffiliatedInstitutionsComponent,
  MetadataContributorsComponent,
  MetadataDateInfoComponent,
  MetadataDescriptionComponent,
  MetadataFundingComponent,
  MetadataLicenseComponent,
  MetadataPublicationDoiComponent,
  MetadataRegistrationDoiComponent,
  MetadataResourceInformationComponent,
  MetadataSubjectsComponent,
  MetadataTagsComponent,
  MetadataTitleComponent,
} from './components';
import {
  AffiliatedInstitutionsDialogComponent,
  ContributorsDialogComponent,
  DescriptionDialogComponent,
  FundingDialogComponent,
  LicenseDialogComponent,
  PublicationDoiDialogComponent,
  ResourceInformationDialogComponent,
  ResourceInfoTooltipComponent,
} from './dialogs';
import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
  DialogValueModel,
} from './models';
import {
  CreateCedarMetadataRecord,
  CreateDoi,
  GetCedarMetadataRecords,
  GetCedarMetadataTemplates,
  GetCustomItemMetadata,
  GetResourceMetadata,
  MetadataSelectors,
  UpdateCedarMetadataRecord,
  UpdateCustomItemMetadata,
  UpdateResourceDetails,
  UpdateResourceLicense,
} from './store';

@Component({
  selector: 'osf-metadata',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    MetadataTabsComponent,
    MetadataSubjectsComponent,
    MetadataPublicationDoiComponent,
    MetadataLicenseComponent,
    MetadataAffiliatedInstitutionsComponent,
    MetadataDescriptionComponent,
    MetadataContributorsComponent,
    MetadataResourceInformationComponent,
    MetadataFundingComponent,
    MetadataDateInfoComponent,
    MetadataTagsComponent,
    MetadataTitleComponent,
    MetadataRegistrationDoiComponent,
  ],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataComponent implements OnInit {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly translateService = inject(TranslateService);
  private readonly toastService = inject(ToastService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly environment = inject(ENVIRONMENT);

  private resourceId = '';

  tabs = signal<MetadataTabsModel[]>([]);
  selectedTab = signal('osf');

  selectedCedarRecord = signal<CedarMetadataRecordData | null>(null);
  selectedCedarTemplate = signal<CedarMetadataDataTemplateJsonApi | null>(null);
  cedarFormReadonly = signal<boolean>(true);
  metadata = select(MetadataSelectors.getResourceMetadata);
  isMetadataLoading = select(MetadataSelectors.getLoading);
  customItemMetadata = select(MetadataSelectors.getCustomItemMetadata);
  contributors = select(ContributorsSelectors.getContributors);
  isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  cedarRecords = select(MetadataSelectors.getCedarRecords);
  cedarTemplates = select(MetadataSelectors.getCedarTemplates);
  selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  isSubjectsUpdating = select(SubjectsSelectors.areSelectedSubjectsLoading);
  resourceType = signal<ResourceType>(this.activeRoute.parent?.snapshot.data['resourceType'] || ResourceType.Project);
  isSubmitting = select(MetadataSelectors.getSubmitting);
  affiliatedInstitutions = select(InstitutionsSelectors.getResourceInstitutions);
  areInstitutionsLoading = select(InstitutionsSelectors.areResourceInstitutionsLoading);
  areResourceInstitutionsSubmitting = select(InstitutionsSelectors.areResourceInstitutionsSubmitting);

  provider = this.environment.defaultProvider;
  isMedium = toSignal(inject(IS_MEDIUM));

  private readonly resourceNameMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'project'],
    [ResourceType.Registration, 'registration'],
  ]);

  actions = createDispatchMap({
    getResourceMetadata: GetResourceMetadata,
    updateMetadata: UpdateResourceDetails,
    updateResourceLicense: UpdateResourceLicense,
    getCustomItemMetadata: GetCustomItemMetadata,
    updateCustomItemMetadata: UpdateCustomItemMetadata,
    getContributors: GetAllContributors,
    updateResourceInstitutions: UpdateResourceInstitutions,
    fetchResourceInstitutions: FetchResourceInstitutions,
    createDoi: CreateDoi,

    getCedarRecords: GetCedarMetadataRecords,
    getCedarTemplates: GetCedarMetadataTemplates,
    createCedarRecord: CreateCedarMetadataRecord,
    updateCedarRecord: UpdateCedarMetadataRecord,

    fetchSubjects: FetchSubjects,
    fetchSelectedSubjects: FetchSelectedSubjects,
    fetchChildrenSubjects: FetchChildrenSubjects,
    updateResourceSubjects: UpdateResourceSubjects,
  });

  isLoading = computed(() => {
    return (
      this.isMetadataLoading() ||
      this.isContributorsLoading() ||
      this.areInstitutionsLoading() ||
      this.isSubmitting() ||
      this.areResourceInstitutionsSubmitting()
    );
  });

  hideEditDoi = computed(() => {
    return (
      this.resourceType() === ResourceType.Project &&
      (!!this.metadata()?.identifiers?.length || !this.metadata()?.public)
    );
  });

  isRegistrationType = computed(() => this.resourceType() === ResourceType.Registration);

  bibliographicContributors = computed(() => this.contributors().filter((contributor) => contributor.isBibliographic));

  hasWriteAccess = computed(() => {
    const metadata = this.metadata();
    if (!metadata) return false;
    return metadata.currentUserPermissions.includes(UserPermissions.Write);
  });

  hasAdminAccess = computed(() => {
    const metadata = this.metadata();
    if (!metadata) return false;
    return metadata.currentUserPermissions.includes(UserPermissions.Admin);
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
      const metadata = this.metadata();

      if (this.resourceType() === ResourceType.Registration) {
        if (metadata) {
          this.provider = metadata.provider || this.environment.defaultProvider;
          this.actions.fetchSubjects(this.resourceType(), this.provider);
        }
      } else {
        this.actions.fetchSubjects(this.resourceType());
      }
    });
  }

  ngOnInit(): void {
    this.resourceId = this.activeRoute.parent?.parent?.snapshot.params['id'];
    if (this.resourceId && this.resourceType()) {
      this.actions.getResourceMetadata(this.resourceId, this.resourceType());
      this.actions.getCustomItemMetadata(this.resourceId);
      this.actions.getContributors(this.resourceId, this.resourceType());
      this.actions.fetchResourceInstitutions(this.resourceId, this.resourceType());
      this.actions.getCedarRecords(this.resourceId, this.resourceType());
      this.actions.getCedarTemplates();
      this.actions.fetchSelectedSubjects(this.resourceId, this.resourceType());
    }
  }

  onTabChange(tabId: string | number): void {
    const tab = this.tabs().find((x) => x.id === tabId.toString());

    if (!tab) {
      return;
    }

    this.selectedTab.set(tab.id as MetadataResourceEnum);

    if (tab.type === 'cedar') {
      this.selectedCedarRecord.set(null);
      this.selectedCedarTemplate.set(null);
      const currentRecordId = this.activeRoute.snapshot.paramMap.get('recordId');
      if (currentRecordId !== tab.id) {
        this.router.navigate(['metadata', tab.id], { relativeTo: this.activeRoute.parent?.parent });
        this.loadCedarRecord(tab.id);
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

    if (selectedRecord.id) {
      this.actions
        .updateCedarRecord(data, selectedRecord.id, this.resourceId, this.resourceType())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.cedarFormReadonly.set(true);
            this.toastService.showSuccess(this.translateService.instant('files.detail.toast.cedarUpdated'));
            this.actions.getCedarRecords(this.resourceId, this.resourceType());
          },
        });
    }
  }

  onCedarFormChangeTemplate(): void {
    this.router.navigate(['add'], { relativeTo: this.activeRoute });
  }

  openAddRecord(): void {
    this.router.navigate(['../add'], { relativeTo: this.activeRoute });
  }

  onTagsChanged(tags: string[]): void {
    this.actions.updateMetadata(this.resourceId, this.resourceType(), { tags });
  }

  openEditContributorDialog(): void {
    this.customDialogService
      .open(ContributorsDialogComponent, {
        header: this.translateService.instant('project.metadata.contributors.editContributors'),
        breakpoints: { '768px': '95vw' },
        data: {
          resourceId: this.resourceId,
          resourceType: this.resourceType(),
        },
      })
      .onClose.pipe(filter((result) => !!result))
      .subscribe(() => {
        this.actions.getResourceMetadata(this.resourceId, this.resourceType());
        this.toastService.showSuccess('project.metadata.contributors.updateSucceed');
      });
  }

  openEditTitleDialog(): void {
    this.customDialogService
      .open(EditTitleDialogComponent, {
        header: 'project.metadata.editTitle',
        width: '500px',
        data: this.metadata()?.title,
      })
      .onClose.pipe(
        filter((result: DialogValueModel) => !!result),
        switchMap((result) => {
          if (this.resourceId) {
            return this.actions.updateMetadata(this.resourceId, this.resourceType(), { title: result.value });
          }
          return EMPTY;
        })
      )
      .subscribe(() => this.toastService.showSuccess('project.metadata.titleUpdated'));
  }

  openEditDescriptionDialog(): void {
    this.customDialogService
      .open(DescriptionDialogComponent, {
        header: 'project.metadata.description.dialog.header',
        width: '500px',
        data: this.metadata()?.description,
      })
      .onClose.pipe(
        filter((result: DialogValueModel) => !!result),
        switchMap((result) => {
          if (this.resourceId) {
            return this.actions.updateMetadata(this.resourceId, this.resourceType(), { description: result.value });
          }
          return EMPTY;
        })
      )
      .subscribe(() => this.toastService.showSuccess('project.metadata.description.updated'));
  }

  openEditResourceInformationDialog(): void {
    const currentCustomMetadata = this.customItemMetadata();

    this.customDialogService
      .open(ResourceInformationDialogComponent, {
        header: 'project.metadata.resourceInformation.dialog.header',
        width: '500px',
        data: {
          customItemMetadata: currentCustomMetadata,
        },
      })
      .onClose.pipe(
        filter((result) => !!result && (result.resourceTypeGeneral || result.language)),
        switchMap((result) => {
          const updatedMetadata = {
            ...currentCustomMetadata,
            ...result,
          };
          return this.actions.updateCustomItemMetadata(this.resourceId, updatedMetadata);
        })
      )
      .subscribe(() => this.toastService.showSuccess('project.metadata.resourceInformation.updated'));
  }

  onShowResourceInfo() {
    const dialogWidth = this.isMedium() ? '850px' : '95vw';

    this.customDialogService.open(ResourceInfoTooltipComponent, {
      header: 'project.metadata.resourceInformation.tooltipDialog.header',
      width: dialogWidth,
      data: this.resourceNameMap.get(this.resourceType()),
    });
  }

  openEditLicenseDialog(): void {
    this.customDialogService
      .open(LicenseDialogComponent, {
        header: 'project.metadata.license.dialog.header',
        width: '600px',
        data: {
          metadata: this.metadata(),
        },
      })
      .onClose.pipe(
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
      .subscribe(() => this.toastService.showSuccess('project.metadata.license.updated'));
  }

  openEditFundingDialog(): void {
    const currentCustomMetadata = this.customItemMetadata();

    this.customDialogService
      .open(FundingDialogComponent, {
        header: 'project.metadata.funding.dialog.header',
        width: '600px',
        data: {
          funders: currentCustomMetadata?.funders || [],
        },
      })
      .onClose.pipe(
        filter((result) => !!result && result.fundingEntries),
        switchMap((result) => {
          const updatedMetadata = {
            ...currentCustomMetadata,
            funders: result.fundingEntries,
          };
          return this.actions.updateCustomItemMetadata(this.resourceId, updatedMetadata);
        })
      )
      .subscribe(() => this.toastService.showSuccess('project.metadata.funding.updated'));
  }

  openEditAffiliatedInstitutionsDialog(): void {
    this.customDialogService
      .open(AffiliatedInstitutionsDialogComponent, {
        header: 'project.metadata.affiliatedInstitutions.dialog.header',
        width: '500px',
        data: this.affiliatedInstitutions(),
      })
      .onClose.pipe(
        filter((result) => !!result),
        switchMap((institutions) =>
          this.actions.updateResourceInstitutions(this.resourceId, this.resourceType(), institutions)
        )
      )
      .subscribe(() => this.toastService.showSuccess('project.metadata.affiliatedInstitutions.updated'));
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
    if (this.resourceType() === ResourceType.Project) {
      this.customConfirmationService.confirmDelete({
        headerKey: this.translateService.instant('project.metadata.doi.dialog.createConfirm.header'),
        messageKey: this.translateService.instant('project.metadata.doi.dialog.createConfirm.message'),
        acceptLabelKey: this.translateService.instant('common.buttons.create'),
        acceptLabelType: 'primary',
        onConfirm: () => {
          this.actions.createDoi(this.resourceId, this.resourceType()).subscribe({
            next: () => {
              this.toastService.showSuccess('project.metadata.doi.created');
            },
          });
        },
      });
    } else {
      this.openEditPublicationDoi();
    }
  }

  private openEditPublicationDoi() {
    this.customDialogService
      .open(PublicationDoiDialogComponent, {
        header: 'project.metadata.doi.dialog.header',
        width: '600px',
        data: this.metadata()?.publicationDoi,
      })
      .onClose.pipe(
        filter((result: DialogValueModel) => !!result),
        switchMap((result) =>
          this.actions.updateMetadata(this.resourceId, this.resourceType(), { article_doi: result.value })
        )
      )
      .subscribe(() => this.toastService.showSuccess('project.metadata.publicationDoi.updated'));
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
    const recordId = this.activeRoute.snapshot.paramMap.get('recordId');

    const tab = this.tabs().find((tab) => tab.id === recordId);

    if (tab) {
      this.selectedTab.set(tab.id);

      if (tab.type === 'cedar') {
        this.loadCedarRecord(tab.id);
      }
    }
  }
}
