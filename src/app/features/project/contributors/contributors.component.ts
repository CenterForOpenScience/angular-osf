import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

import { debounceTime, distinctUntilChanged, filter, forkJoin, map, of, switchMap } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SearchInputComponent, ViewOnlyTableComponent } from '@osf/shared/components';
import { SelectOption } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';
import { defaultConfirmationConfig, findChangedItems } from '@osf/shared/utils';

import { ViewOnlyLink, ViewOnlyLinkModel } from '../settings/models';
import {
  CreateViewOnlyLink,
  DeleteViewOnlyLink,
  GetProjectDetails,
  GetViewOnlyLinksTable,
  SettingsSelectors,
} from '../settings/store';

import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorEducationHistoryComponent,
  ContributorEmploymentHistoryComponent,
  ContributorsListComponent,
  CreateViewLinkDialogComponent,
} from './components';
import { BIBLIOGRAPHY_OPTIONS, PERMISSION_OPTIONS } from './constants';
import { AddContributorType, ContributorPermission } from './enums';
import { ContributorDialogAddModel, ContributorModel } from './models';
import {
  AddContributor,
  ContributorsSelectors,
  DeleteContributor,
  GetAllContributors,
  UpdateBibliographyFilter,
  UpdateContributor,
  UpdatePermissionFilter,
  UpdateSearchValue,
} from './store';

@Component({
  selector: 'osf-contributors',
  imports: [
    Button,
    SearchInputComponent,
    Select,
    TranslatePipe,
    FormsModule,
    TableModule,
    ContributorsListComponent,
    ViewOnlyTableComponent,
  ],
  templateUrl: './contributors.component.html',
  styleUrl: './contributors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ContributorsComponent implements OnInit {
  protected searchControl = new FormControl<string>('');

  readonly destroyRef = inject(DestroyRef);
  readonly translateService = inject(TranslateService);
  readonly confirmationService = inject(ConfirmationService);
  readonly dialogService = inject(DialogService);
  readonly toastService = inject(ToastService);

  private readonly route = inject(ActivatedRoute);
  private readonly projectId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));

  protected viewOnlyLinks = select(SettingsSelectors.getViewOnlyLinks);
  protected projectDetails = select(SettingsSelectors.getProjectDetails);

  protected readonly selectedPermission = signal<ContributorPermission | null>(null);
  protected readonly selectedBibliography = signal<boolean | null>(null);
  protected readonly permissionsOptions: SelectOption[] = PERMISSION_OPTIONS;
  protected readonly bibliographyOptions: SelectOption[] = BIBLIOGRAPHY_OPTIONS;

  protected initialContributors = select(ContributorsSelectors.getContributors);
  protected contributors = signal([]);
  protected readonly isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  protected readonly isViewOnlyLinksLoading = select(SettingsSelectors.isViewOnlyLinksLoading);

  protected actions = createDispatchMap({
    getViewOnlyLinks: GetViewOnlyLinksTable,
    getProjectDetails: GetProjectDetails,
    getContributors: GetAllContributors,
    updateSearchValue: UpdateSearchValue,
    updatePermissionFilter: UpdatePermissionFilter,
    updateBibliographyFilter: UpdateBibliographyFilter,
    deleteContributor: DeleteContributor,
    updateContributor: UpdateContributor,
    addContributor: AddContributor,
    createViewOnlyLink: CreateViewOnlyLink,
    deleteViewOnlyLink: DeleteViewOnlyLink,
  });

  get hasChanges(): boolean {
    return JSON.stringify(this.initialContributors()) !== JSON.stringify(this.contributors());
  }

  constructor() {
    effect(() => {
      this.contributors.set(JSON.parse(JSON.stringify(this.initialContributors())));

      if (this.isContributorsLoading()) {
        this.searchControl.disable();
      } else {
        this.searchControl.enable();
      }
    });
  }

  ngOnInit(): void {
    const id = this.projectId();

    if (id) {
      this.actions.getViewOnlyLinks(id);
      this.actions.getProjectDetails(id);
      this.actions.getContributors(this.projectId());
    }

    this.setSearchSubscription();
  }

  private setSearchSubscription() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.actions.updateSearchValue(res ?? null));
  }

  protected onPermissionChange(value: ContributorPermission): void {
    this.actions.updatePermissionFilter(value);
  }

  protected onBibliographyChange(value: boolean): void {
    this.actions.updateBibliographyFilter(value);
  }

  cancel() {
    this.contributors.set(JSON.parse(JSON.stringify(this.initialContributors())));
  }

  save() {
    const updatedContributors = findChangedItems(this.initialContributors(), this.contributors(), 'id');

    const updateRequests = updatedContributors.map((payload) =>
      this.actions.updateContributor(this.projectId(), payload)
    );

    forkJoin(updateRequests).subscribe(() => {
      this.toastService.showSuccess('project.contributors.toastMessages.multipleUpdateSuccessMessage');
    });
  }

  openEmploymentHistory(contributor: ContributorModel) {
    this.dialogService.open(ContributorEmploymentHistoryComponent, {
      width: '552px',
      data: contributor.employment,
      focusOnShow: false,
      header: this.translateService.instant('project.contributors.table.headers.employment'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  openEducationHistory(contributor: ContributorModel) {
    this.dialogService.open(ContributorEducationHistoryComponent, {
      width: '552px',
      data: contributor.education,
      focusOnShow: false,
      header: this.translateService.instant('project.contributors.table.headers.education'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  openAddContributorDialog() {
    const addedContributorIds = this.initialContributors().map((x) => x.userId);

    this.dialogService
      .open(AddContributorDialogComponent, {
        width: '448px',
        data: addedContributorIds,
        focusOnShow: false,
        header: this.translateService.instant('project.contributors.addDialog.addRegisteredContributor'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.pipe(
        filter((res: ContributorDialogAddModel) => !!res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: ContributorDialogAddModel) => {
        if (res.type === AddContributorType.Unregistered) {
          this.openAddUnregisteredContributorDialog();
        } else {
          const addRequests = res.data.map((payload) => this.actions.addContributor(this.projectId(), payload));

          forkJoin(addRequests).subscribe(() => {
            this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage');
          });
        }
      });
  }

  openAddUnregisteredContributorDialog() {
    this.dialogService
      .open(AddUnregisteredContributorDialogComponent, {
        width: '448px',
        focusOnShow: false,
        header: this.translateService.instant('project.contributors.addDialog.addUnregisteredContributor'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.pipe(
        filter((res: ContributorDialogAddModel) => !!res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: ContributorDialogAddModel) => {
        if (res.type === AddContributorType.Registered) {
          this.openAddContributorDialog();
        } else {
          const successMessage = this.translateService.instant('project.contributors.toastMessages.addSuccessMessage');
          const params = { name: res.data[0].fullName };

          this.actions.addContributor(this.projectId(), res.data[0]).subscribe({
            next: () => this.toastService.showSuccess(successMessage, params),
          });
        }
      });
  }

  removeContributor(contributor: ContributorModel) {
    this.confirmationService.confirm({
      ...defaultConfirmationConfig,
      header: this.translateService.instant('project.contributors.removeDialog.title'),
      message: this.translateService.instant('project.contributors.removeDialog.message', {
        name: contributor.fullName,
      }),
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: this.translateService.instant('common.buttons.remove'),
      },
      accept: () => {
        this.actions
          .deleteContributor(this.projectId(), contributor.userId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () =>
              this.toastService.showSuccess('project.contributors.removeDialog.successMessage', {
                name: contributor.fullName,
              }),
          });
      },
    });
  }

  createViewLink() {
    const sharedComponents = [
      {
        id: this.projectDetails().id,
        title: this.projectDetails().attributes.title,
        category: 'project',
      },
    ];

    this.dialogService
      .open(CreateViewLinkDialogComponent, {
        width: '448px',
        focusOnShow: false,
        header: this.translateService.instant('project.contributors.createLinkDialog.dialogTitle'),
        data: { sharedComponents, projectId: this.projectId() },
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.pipe(
        filter((res) => !!res),
        switchMap((result) => this.actions.createViewOnlyLink(this.projectId(), result as ViewOnlyLink)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  deleteLinkItem(link: ViewOnlyLinkModel): void {
    this.confirmationService.confirm({
      ...defaultConfirmationConfig,
      message: this.translateService.instant('myProjects.settings.delete.message'),
      header: this.translateService.instant('myProjects.settings.delete.title', {
        name: link.name,
      }),
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: this.translateService.instant('settings.developerApps.list.deleteButton'),
      },
      accept: () => {
        this.actions.deleteViewOnlyLink(this.projectId(), link.id);
      },
    });
  }
}
