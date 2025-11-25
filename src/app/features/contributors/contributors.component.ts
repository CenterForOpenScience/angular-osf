import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

import { debounceTime, distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorsTableComponent,
  RequestAccessTableComponent,
} from '@osf/shared/components/contributors';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { ViewOnlyTableComponent } from '@osf/shared/components/view-only-table/view-only-table.component';
import { BIBLIOGRAPHY_OPTIONS, PERMISSION_OPTIONS } from '@osf/shared/constants/contributors.constants';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { AddContributorType } from '@osf/shared/enums/contributors/add-contributor-type.enum';
import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { findChangedItems } from '@osf/shared/helpers/find-changed-items.helper';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  AcceptRequestAccess,
  BulkAddContributors,
  BulkAddContributorsFromParentProject,
  BulkUpdateContributors,
  ContributorsSelectors,
  DeleteContributor,
  GetAllContributors,
  GetRequestAccessContributors,
  LoadMoreContributors,
  RejectRequestAccess,
  ResetContributorsState,
  UpdateBibliographyFilter,
  UpdateContributorsSearchValue,
  UpdatePermissionFilter,
} from '@osf/shared/stores/contributors';
import {
  CurrentResourceSelectors,
  GetResourceDetails,
  GetResourceWithChildren,
} from '@osf/shared/stores/current-resource';
import {
  CreateViewOnlyLink,
  DeleteViewOnlyLink,
  FetchViewOnlyLinks,
  ViewOnlyLinkSelectors,
} from '@osf/shared/stores/view-only-links';
import { ComponentCheckboxItemModel } from '@shared/models/component-checkbox-item.model';
import { ContributorModel } from '@shared/models/contributors/contributor.model';
import { ContributorDialogAddModel } from '@shared/models/contributors/contributor-dialog-add.model';
import { NodeShortInfoModel } from '@shared/models/nodes/node-with-children.model';
import { RequestAccessModel } from '@shared/models/request-access/request-access.model';
import { SelectOption } from '@shared/models/select-option.model';
import { TableParameters } from '@shared/models/table-parameters.model';
import { ViewOnlyLinkModel } from '@shared/models/view-only-links/view-only-link.model';
import { ViewOnlyLinkJsonApi } from '@shared/models/view-only-links/view-only-link-response.model';

import { CreateViewLinkDialogComponent } from './components';
import { ResourceInfoModel } from './models';

@Component({
  selector: 'osf-contributors',
  imports: [
    Button,
    SearchInputComponent,
    Select,
    TranslatePipe,
    FormsModule,
    TableModule,
    ContributorsTableComponent,
    RequestAccessTableComponent,
    ViewOnlyTableComponent,
  ],
  templateUrl: './contributors.component.html',
  styleUrl: './contributors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsComponent implements OnInit, OnDestroy {
  searchControl = new FormControl<string>('');

  readonly destroyRef = inject(DestroyRef);
  readonly customDialogService = inject(CustomDialogService);
  readonly toastService = inject(ToastService);
  readonly customConfirmationService = inject(CustomConfirmationService);
  readonly loaderService = inject(LoaderService);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly resourceId = toSignal(
    this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined)
  );
  readonly resourceType = toSignal(this.route.data.pipe(map((params) => params['resourceType'])) ?? of(undefined));

  viewOnlyLinks = select(ViewOnlyLinkSelectors.getViewOnlyLinks);
  resourceDetails = select(CurrentResourceSelectors.getResourceDetails);
  resourceChildren = select(CurrentResourceSelectors.getResourceWithChildren);

  readonly selectedPermission = signal<ContributorPermission | null>(null);
  readonly selectedBibliography = signal<boolean | null>(null);
  readonly permissionsOptions: SelectOption[] = PERMISSION_OPTIONS;
  readonly bibliographyOptions: SelectOption[] = BIBLIOGRAPHY_OPTIONS;

  contributors = signal<ContributorModel[]>([]);

  readonly initialContributors = select(ContributorsSelectors.getContributors);
  readonly requestAccessList = select(ContributorsSelectors.getRequestAccessList);
  readonly areRequestAccessListLoading = select(ContributorsSelectors.areRequestAccessListLoading);
  readonly isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  readonly contributorsTotalCount = select(ContributorsSelectors.getContributorsTotalCount);
  readonly isViewOnlyLinksLoading = select(ViewOnlyLinkSelectors.isViewOnlyLinksLoading);
  readonly hasAdminAccess = select(CurrentResourceSelectors.hasResourceAdminAccess);
  readonly resourceAccessRequestEnabled = select(CurrentResourceSelectors.resourceAccessRequestEnabled);
  readonly currentUser = select(UserSelectors.getCurrentUser);
  pageSize = select(ContributorsSelectors.getContributorsPageSize);
  isLoadingMore = select(ContributorsSelectors.isContributorsLoadingMore);

  readonly tableParams = computed<TableParameters>(() => ({
    ...DEFAULT_TABLE_PARAMS,
    totalRecords: this.contributorsTotalCount(),
    paginator: false,
    scrollable: true,
    firstRowIndex: 0,
    rows: this.pageSize(),
  }));

  canCreateViewLink = computed(() => !!this.resourceDetails() && !!this.resourceId());
  searchPlaceholder = computed(() =>
    this.resourceType() === ResourceType.Project
      ? 'project.contributors.searchProjectPlaceholder'
      : 'project.contributors.searchRegistrationPlaceholder'
  );

  showRequestAccessList = computed(
    () =>
      this.resourceAccessRequestEnabled() &&
      this.hasAdminAccess() &&
      this.resourceType() === ResourceType.Project &&
      this.requestAccessList().length
  );

  actions = createDispatchMap({
    getViewOnlyLinks: FetchViewOnlyLinks,
    getResourceDetails: GetResourceDetails,
    getContributors: GetAllContributors,
    loadMoreContributors: LoadMoreContributors,
    updateSearchValue: UpdateContributorsSearchValue,
    updatePermissionFilter: UpdatePermissionFilter,
    updateBibliographyFilter: UpdateBibliographyFilter,
    deleteContributor: DeleteContributor,
    bulkUpdateContributors: BulkUpdateContributors,
    bulkAddContributors: BulkAddContributors,
    bulkAddContributorsFromParentProject: BulkAddContributorsFromParentProject,
    createViewOnlyLink: CreateViewOnlyLink,
    deleteViewOnlyLink: DeleteViewOnlyLink,
    getRequestAccessContributors: GetRequestAccessContributors,
    acceptRequestAccess: AcceptRequestAccess,
    rejectRequestAccess: RejectRequestAccess,
    getResourceWithChildren: GetResourceWithChildren,
    resetContributorsState: ResetContributorsState,
  });

  get hasChanges(): boolean {
    return JSON.stringify(this.initialContributors()) !== JSON.stringify(this.contributors());
  }

  constructor() {
    this.setupEffects();
  }

  ngOnInit(): void {
    const id = this.resourceId();

    if (id) {
      this.actions.getResourceDetails(id, this.resourceType());
      this.actions.getContributors(id, this.resourceType());
    }

    this.setSearchSubscription();
  }

  ngOnDestroy(): void {
    this.actions.resetContributorsState();
  }

  private setSearchSubscription() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.actions.updateSearchValue(res ?? null));
  }

  setupEffects() {
    effect(() => {
      this.contributors.set(structuredClone(this.initialContributors()));

      if (this.isContributorsLoading()) {
        this.searchControl.disable();
      } else {
        this.searchControl.enable();
      }
    });

    effect(() => {
      if (this.hasAdminAccess()) {
        this.actions.getViewOnlyLinks(this.resourceId(), this.resourceType());
      }
    });

    effect(() => {
      if (
        this.resourceType() === ResourceType.Project &&
        this.hasAdminAccess() &&
        this.resourceAccessRequestEnabled()
      ) {
        this.actions.getRequestAccessContributors(this.resourceId(), this.resourceType());
      }
    });
  }

  onPermissionChange(value: ContributorPermission): void {
    this.actions.updatePermissionFilter(value);
  }

  onBibliographyChange(value: boolean): void {
    this.actions.updateBibliographyFilter(value);
  }

  cancel() {
    this.contributors.set(structuredClone(this.initialContributors()));
  }

  save() {
    const updatedContributors = findChangedItems(this.initialContributors(), this.contributors(), 'id');

    this.actions
      .bulkUpdateContributors(this.resourceId(), this.resourceType(), updatedContributors)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() =>
        this.toastService.showSuccess('project.contributors.toastMessages.multipleUpdateSuccessMessage')
      );
  }

  openAddContributorDialog() {
    const resourceDetails = this.resourceDetails();
    const resourceId = this.resourceId();
    const rootParentId = resourceDetails.rootParentId ?? resourceId;

    this.loaderService.show();

    this.actions
      .getResourceWithChildren(rootParentId, resourceId, this.resourceType())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loaderService.hide();

        const components = this.mapNodesToComponentCheckboxItems(this.resourceChildren(), resourceId);

        this.customDialogService
          .open(AddContributorDialogComponent, {
            header: 'project.contributors.addDialog.addRegisteredContributor',
            width: '448px',
            data: {
              components,
              resourceName: resourceDetails.title,
              parentResourceName: resourceDetails.parent?.title,
              allowAddingContributorsFromParentProject:
                this.resourceType() === ResourceType.Project &&
                resourceDetails.rootParentId &&
                resourceDetails.rootParentId !== resourceId,
            },
          })
          .onClose.pipe(
            filter((res: ContributorDialogAddModel) => !!res),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe((res: ContributorDialogAddModel) => {
            if (res.type === AddContributorType.ParentProject) {
              this.addContributorsFromParentProjectToComponents();
            } else if (res.type === AddContributorType.Unregistered) {
              this.openAddUnregisteredContributorDialog();
            } else {
              this.addContributorsToComponents(res);
            }
          });
      });
  }

  private mapNodesToComponentCheckboxItems(
    nodes: NodeShortInfoModel[],
    currentResourceId: string | undefined
  ): ComponentCheckboxItemModel[] {
    return nodes.map((node) => ({
      id: node.id,
      title: node.title,
      isCurrent: node.id === currentResourceId,
      disabled: node.id === currentResourceId || !node.permissions.includes(UserPermissions.Admin),
      checked: node.id === currentResourceId,
      parentId: node.parentId,
    }));
  }

  private addContributorsToComponents(result: ContributorDialogAddModel): void {
    this.actions
      .bulkAddContributors(this.resourceId(), this.resourceType(), result.data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage'));
  }

  private addContributorsFromParentProjectToComponents(): void {
    this.actions
      .bulkAddContributorsFromParentProject(this.resourceId(), this.resourceType())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage'));
  }

  openAddUnregisteredContributorDialog() {
    this.customDialogService
      .open(AddUnregisteredContributorDialogComponent, {
        header: 'project.contributors.addDialog.addUnregisteredContributor',
        width: '448px',
      })
      .onClose.pipe(
        filter((res: ContributorDialogAddModel) => !!res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: ContributorDialogAddModel) => {
        if (res.type === AddContributorType.Registered) {
          this.openAddContributorDialog();
        } else {
          const params = { name: res.data[0].fullName };

          this.actions.bulkAddContributors(this.resourceId(), this.resourceType(), res.data).subscribe({
            next: () => this.toastService.showSuccess('project.contributors.toastMessages.addSuccessMessage', params),
          });
        }
      });
  }

  acceptRequest(requestAccessItem: RequestAccessModel) {
    this.customConfirmationService.confirmAccept({
      headerKey: 'project.requestAccess.acceptDialog.header',
      messageKey: 'project.requestAccess.acceptDialog.message',
      messageParams: { name: requestAccessItem.creator?.fullName },
      acceptLabelKey: 'common.buttons.accept',
      onConfirm: () => {
        const payload = { permissions: requestAccessItem.requestedPermissions };

        this.actions
          .acceptRequestAccess(requestAccessItem.id, this.resourceId(), this.resourceType(), payload)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.toastService.showSuccess('project.requestAccess.acceptDialog.successMessage'));
      },
    });
  }

  rejectRequest(requestAccessItem: RequestAccessModel) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'project.requestAccess.rejectDialog.header',
      messageKey: 'project.requestAccess.rejectDialog.message',
      messageParams: { name: requestAccessItem.creator?.fullName },
      acceptLabelKey: 'common.buttons.reject',
      onConfirm: () => {
        this.actions
          .rejectRequestAccess(requestAccessItem.id, this.resourceId(), this.resourceType())
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.toastService.showSuccess('project.requestAccess.rejectDialog.successMessage'));
      },
    });
  }

  removeContributor(contributor: ContributorModel) {
    const isDeletingSelf = contributor.userId === this.currentUser()?.id;

    this.customConfirmationService.confirmDelete({
      headerKey: 'project.contributors.removeDialog.title',
      messageKey: 'project.contributors.removeDialog.message',
      messageParams: { name: contributor.fullName },
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions
          .deleteContributor(this.resourceId(), this.resourceType(), contributor.userId, isDeletingSelf)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.toastService.showSuccess('project.contributors.removeDialog.successMessage', {
              name: contributor.fullName,
            });

            if (isDeletingSelf) {
              this.router.navigate(['/']);
            }
          });
      },
    });
  }

  loadMoreContributors(): void {
    this.actions.loadMoreContributors(this.resourceId(), this.resourceType());
  }

  createViewLink() {
    const currentResource: ResourceInfoModel = {
      id: this.resourceDetails().id,
      title: this.resourceDetails().title,
      type: this.resourceType(),
      rootParentId: this.resourceDetails().rootParentId,
    };

    this.customDialogService
      .open(CreateViewLinkDialogComponent, {
        header: 'project.contributors.createLinkDialog.dialogTitle',
        width: '448px',
        data: currentResource,
      })
      .onClose.pipe(
        filter((res) => !!res),
        switchMap((result) =>
          this.actions.createViewOnlyLink(this.resourceId(), this.resourceType(), result as ViewOnlyLinkJsonApi)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.toastService.showSuccess('myProjects.settings.viewOnlyLinkCreated'));
  }

  deleteLinkItem(link: ViewOnlyLinkModel): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'myProjects.settings.delete.title',
      headerParams: { name: link.name },
      messageKey: 'myProjects.settings.delete.message',
      onConfirm: () =>
        this.actions
          .deleteViewOnlyLink(this.resourceId(), this.resourceType(), link.id)
          .subscribe(() => this.toastService.showSuccess('myProjects.settings.viewOnlyLinkDeleted')),
    });
  }
}
