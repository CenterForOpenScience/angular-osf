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
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { SearchInputComponent, ViewOnlyTableComponent } from '@osf/shared/components';
import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorsTableComponent,
  RequestAccessTableComponent,
} from '@osf/shared/components/contributors';
import { BIBLIOGRAPHY_OPTIONS, PERMISSION_OPTIONS } from '@osf/shared/constants';
import { AddContributorType, ContributorPermission, ResourceType } from '@osf/shared/enums';
import { findChangedItems } from '@osf/shared/helpers';
import {
  ContributorDialogAddModel,
  ContributorModel,
  SelectOption,
  ViewOnlyLinkJsonApi,
  ViewOnlyLinkModel,
} from '@osf/shared/models';
import { CustomConfirmationService, CustomDialogService, ToastService } from '@osf/shared/services';
import {
  AcceptRequestAccess,
  AddContributor,
  BulkAddContributors,
  BulkUpdateContributors,
  ContributorsSelectors,
  CreateViewOnlyLink,
  CurrentResourceSelectors,
  DeleteContributor,
  DeleteViewOnlyLink,
  FetchViewOnlyLinks,
  GetAllContributors,
  GetRequestAccessContributors,
  GetResourceDetails,
  RejectRequestAccess,
  UpdateBibliographyFilter,
  UpdateContributorsSearchValue,
  UpdatePermissionFilter,
  ViewOnlyLinkSelectors,
} from '@osf/shared/stores';

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
export class ContributorsComponent implements OnInit {
  searchControl = new FormControl<string>('');

  readonly destroyRef = inject(DestroyRef);
  readonly customDialogService = inject(CustomDialogService);
  readonly toastService = inject(ToastService);
  readonly customConfirmationService = inject(CustomConfirmationService);

  private readonly route = inject(ActivatedRoute);
  private readonly resourceId = toSignal(
    this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined)
  );
  readonly resourceType = toSignal(this.route.data.pipe(map((params) => params['resourceType'])) ?? of(undefined));

  viewOnlyLinks = select(ViewOnlyLinkSelectors.getViewOnlyLinks);
  resourceDetails = select(CurrentResourceSelectors.getResourceDetails);

  readonly selectedPermission = signal<ContributorPermission | null>(null);
  readonly selectedBibliography = signal<boolean | null>(null);
  readonly permissionsOptions: SelectOption[] = PERMISSION_OPTIONS;
  readonly bibliographyOptions: SelectOption[] = BIBLIOGRAPHY_OPTIONS;

  contributors = signal<ContributorModel[]>([]);

  readonly initialContributors = select(ContributorsSelectors.getContributors);
  readonly requestAccessList = select(ContributorsSelectors.getRequestAccessList);
  readonly areRequestAccessListLoading = select(ContributorsSelectors.areRequestAccessListLoading);
  readonly isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  readonly isViewOnlyLinksLoading = select(ViewOnlyLinkSelectors.isViewOnlyLinksLoading);
  readonly currentUser = select(UserSelectors.getCurrentUser);

  canCreateViewLink = computed(() => !!this.resourceDetails() && !!this.resourceId());
  searchPlaceholder = computed(() =>
    this.resourceType() === ResourceType.Project
      ? 'project.contributors.searchProjectPlaceholder'
      : 'project.contributors.searchRegistrationPlaceholder'
  );

  isCurrentUserAdminContributor = computed(() => {
    const currentUserId = this.currentUser()?.id;
    const initialContributors = this.initialContributors();
    if (!currentUserId) return false;

    return initialContributors.some(
      (contributor: ContributorModel) =>
        contributor.userId === currentUserId && contributor.permission === ContributorPermission.Admin
    );
  });

  showRequestAccessList = computed(
    () =>
      this.isCurrentUserAdminContributor() &&
      this.requestAccessList().length &&
      this.resourceType() === ResourceType.Project
  );

  actions = createDispatchMap({
    getViewOnlyLinks: FetchViewOnlyLinks,
    getResourceDetails: GetResourceDetails,
    getContributors: GetAllContributors,
    updateSearchValue: UpdateContributorsSearchValue,
    updatePermissionFilter: UpdatePermissionFilter,
    updateBibliographyFilter: UpdateBibliographyFilter,
    deleteContributor: DeleteContributor,
    bulkUpdateContributors: BulkUpdateContributors,
    bulkAddContributors: BulkAddContributors,
    addContributor: AddContributor,
    createViewOnlyLink: CreateViewOnlyLink,
    deleteViewOnlyLink: DeleteViewOnlyLink,
    getRequestAccessContributors: GetRequestAccessContributors,
    acceptRequestAccess: AcceptRequestAccess,
    rejectRequestAccess: RejectRequestAccess,
  });

  get hasChanges(): boolean {
    return JSON.stringify(this.initialContributors()) !== JSON.stringify(this.contributors());
  }

  constructor() {
    effect(() => {
      this.contributors.set(structuredClone(this.initialContributors()));

      if (this.isContributorsLoading()) {
        this.searchControl.disable();
      } else {
        this.searchControl.enable();
      }
    });

    effect(() => {
      if (this.isCurrentUserAdminContributor()) {
        this.actions.getViewOnlyLinks(this.resourceId(), this.resourceType());
      }
    });
  }

  ngOnInit(): void {
    const id = this.resourceId();

    if (id) {
      this.actions.getResourceDetails(id, this.resourceType());
      this.actions.getContributors(id, this.resourceType());

      if (this.resourceType() === ResourceType.Project) {
        this.actions.getRequestAccessContributors(id, this.resourceType());
      }
    }

    this.setSearchSubscription();
  }

  private setSearchSubscription() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.actions.updateSearchValue(res ?? null));
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
    const addedContributorIds = this.initialContributors().map((x) => x.userId);

    this.customDialogService
      .open(AddContributorDialogComponent, {
        header: 'project.contributors.addDialog.addRegisteredContributor',
        width: '448px',
        data: addedContributorIds,
      })
      .onClose.pipe(
        filter((res: ContributorDialogAddModel) => !!res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: ContributorDialogAddModel) => {
        if (res.type === AddContributorType.Unregistered) {
          this.openAddUnregisteredContributorDialog();
        } else {
          this.actions
            .bulkAddContributors(this.resourceId(), this.resourceType(), res.data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() =>
              this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage')
            );
        }
      });
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

          this.actions.addContributor(this.resourceId(), this.resourceType(), res.data[0]).subscribe({
            next: () => this.toastService.showSuccess('project.contributors.toastMessages.addSuccessMessage', params),
          });
        }
      });
  }

  acceptRequest(contributor: ContributorModel) {
    this.customConfirmationService.confirmAccept({
      headerKey: 'project.requestAccess.acceptDialog.header',
      messageKey: 'project.requestAccess.acceptDialog.message',
      messageParams: { name: contributor.fullName },
      acceptLabelKey: 'common.buttons.accept',
      onConfirm: () => {
        const payload = { permissions: contributor.permission };

        this.actions
          .acceptRequestAccess(contributor.id, this.resourceId(), this.resourceType(), payload)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.toastService.showSuccess('project.requestAccess.acceptDialog.successMessage'));
      },
    });
  }

  rejectRequest(contributor: ContributorModel) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'project.requestAccess.rejectDialog.header',
      messageKey: 'project.requestAccess.rejectDialog.message',
      messageParams: { name: contributor.fullName },
      acceptLabelKey: 'common.buttons.reject',
      onConfirm: () => {
        this.actions
          .rejectRequestAccess(contributor.id, this.resourceId(), this.resourceType())
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.toastService.showSuccess('project.requestAccess.rejectDialog.successMessage'));
      },
    });
  }

  removeContributor(contributor: ContributorModel) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'project.contributors.removeDialog.title',
      messageKey: 'project.contributors.removeDialog.message',
      messageParams: { name: contributor.fullName },
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions
          .deleteContributor(this.resourceId(), this.resourceType(), contributor.userId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() =>
            this.toastService.showSuccess('project.contributors.removeDialog.successMessage', {
              name: contributor.fullName,
            })
          );
      },
    });
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
