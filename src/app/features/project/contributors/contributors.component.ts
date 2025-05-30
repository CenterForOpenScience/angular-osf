import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Select } from 'primeng/select';
import { TableModule, TablePageEvent } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

import { filter, map, of, switchMap } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MY_PROJECTS_TABLE_PARAMS } from '@core/constants/my-projects-table.constants';
import { AddContributorDialogComponent } from '@osf/features/project/contributors/components/add-contributor-dialog/add-contributor-dialog.component';
import { CreateViewLinkDialogComponent } from '@osf/features/project/contributors/components/create-view-link-dialog/create-view-link-dialog.component';
import { ViewOnlyLink, ViewOnlyLinkModel } from '@osf/features/project/settings/models';
import {
  CreateViewOnlyLink,
  DeleteViewOnlyLink,
  GetProjectDetails,
  GetViewOnlyLinksTable,
  SettingsSelectors,
} from '@osf/features/project/settings/store';
import { ViewOnlyTableComponent } from '@shared/components';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { defaultConfirmationConfig } from '@shared/helpers';
import { SelectOption, TableParameters } from '@shared/models';
import { IS_WEB, IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-contributors',
  imports: [
    Button,
    SearchInputComponent,
    Select,
    TranslatePipe,
    FormsModule,
    TableModule,
    ViewOnlyTableComponent,
    Tooltip,
    Checkbox,
  ],
  templateUrl: './contributors.component.html',
  styleUrl: './contributors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ContributorsComponent implements OnInit {
  readonly #translateService = inject(TranslateService);
  readonly #dialogService = inject(DialogService);
  readonly #route = inject(ActivatedRoute);
  readonly #store = inject(Store);
  readonly #destroyRef = inject(DestroyRef);
  readonly #confirmationService = inject(ConfirmationService);

  protected searchValue = signal('');

  readonly items = signal([
    {
      name: 'John Doe',
      permissions: 'Administrator',
      bibliographicContributor: true,
      curator: true,
      employmentHistory: 'https://some_link',
      educationHistory: null,
    },
    {
      name: 'Jeremy Wolfe',
      permissions: 'Read + Write',
      bibliographicContributor: false,
      curator: true,
      employmentHistory: null,
      educationHistory: 'https://some_link',
    },
    {
      name: 'John Doe',
      permissions: 'Administrator',
      bibliographicContributor: true,
      curator: true,
      employmentHistory: 'https://some_link',
      educationHistory: 'https://some_link',
    },
  ]);
  readonly projectId = toSignal(this.#route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));

  protected readonly tableParams = signal<TableParameters>({
    ...MY_PROJECTS_TABLE_PARAMS,
  });

  protected readonly selectedPermission = signal<string>('');
  protected readonly selectedBibliography = signal<string>('');
  pageChange = output<TablePageEvent>();
  protected readonly isWeb = toSignal(inject(IS_WEB));
  protected readonly isMobile = toSignal(inject(IS_XSMALL));

  dialogRef: DynamicDialogRef | null = null;

  protected viewOnlyLinks = select(SettingsSelectors.getViewOnlyLinks);
  protected projectDetails = select(SettingsSelectors.getProjectDetails);

  protected readonly permissionsOptions: SelectOption[] = [
    {
      label: this.#translateService.instant('project.contributors.permissions.administrator'),
      value: 'Administrator',
    },
    {
      label: this.#translateService.instant('project.contributors.permissions.readAndWrite'),
      value: 'Read + Write',
    },
    {
      label: this.#translateService.instant('project.contributors.permissions.read'),
      value: 'Read',
    },
  ];

  protected readonly bibliographyOptions: SelectOption[] = [
    {
      label: this.#translateService.instant('project.contributors.bibliography.bibliographic'),
      value: 'Bibliographic',
    },
    {
      label: this.#translateService.instant('project.contributors.bibliography.nonBibliographic'),
      value: 'Non-Bibliographic',
    },
  ];

  protected actions = createDispatchMap({
    getViewOnlyLinks: GetViewOnlyLinksTable,
    getProjectDetails: GetProjectDetails,
  });

  ngOnInit(): void {
    const id = this.projectId();
    if (id) {
      this.actions.getViewOnlyLinks(id);
      this.actions.getProjectDetails(id);
    }
  }

  protected onPermissionChange(value: string): void {
    this.selectedPermission.set(value);
  }

  protected onBibliographyChange(value: string): void {
    this.selectedBibliography.set(value);
  }

  protected onPageChange(event: TablePageEvent): void {
    this.pageChange.emit(event);
  }

  protected onItemPermissionChange(event: TablePageEvent): void {
    console.log(event);
  }

  addContributor() {
    this.dialogRef = this.#dialogService.open(AddContributorDialogComponent, {
      width: '552px',
      focusOnShow: false,
      header: this.#translateService.instant('project.contributors.addContributor'),
      closeOnEscape: true,
      modal: true,
      closable: true,
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
    this.dialogRef = this.#dialogService.open(CreateViewLinkDialogComponent, {
      width: '448px',
      focusOnShow: false,
      header: this.#translateService.instant('project.contributors.createLinkDialog.dialogTitle'),
      data: { sharedComponents, projectId: this.projectId() },
      closeOnEscape: true,
      modal: true,
      closable: true,
    });

    this.dialogRef.onClose
      .pipe(
        filter((res) => !!res),
        switchMap((result) => this.#store.dispatch(new CreateViewOnlyLink(this.projectId(), result as ViewOnlyLink))),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  deleteLinkItem(link: ViewOnlyLinkModel): void {
    this.#confirmationService.confirm({
      ...defaultConfirmationConfig,
      message: this.#translateService.instant('myProjects.settings.delete.message'),
      header: this.#translateService.instant('myProjects.settings.delete.title', {
        name: link.name,
      }),
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: this.#translateService.instant('settings.developerApps.list.deleteButton'),
      },
      accept: () => {
        this.#store.dispatch(new DeleteViewOnlyLink(this.projectId(), link.id)).subscribe();
      },
    });
  }
}
