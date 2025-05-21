import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Select } from 'primeng/select';
import { TableModule, TablePageEvent } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { MY_PROJECTS_TABLE_PARAMS } from '@core/constants/my-projects-table.constants';
import { AddContributorDialogComponent } from '@osf/features/project/contributors/components/add-contributor-dialog/add-contributor-dialog.component';
import { CreateViewLinkDialogComponent } from '@osf/features/project/contributors/components/create-view-link-dialog/create-view-link-dialog.component';
import { LinkTableModel } from '@osf/features/project/settings';
import { ViewOnlyTableComponent } from '@osf/shared';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { SelectOption } from '@shared/entities/select-option.interface';
import { TableParameters } from '@shared/entities/table-parameters.interface';
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
export class ContributorsComponent {
  protected searchValue = signal('');
  readonly #translateService = inject(TranslateService);
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
  protected readonly tableParams = signal<TableParameters>({
    ...MY_PROJECTS_TABLE_PARAMS,
  });

  protected readonly selectedPermission = signal<string>('');
  protected readonly selectedBibliography = signal<string>('');
  pageChange = output<TablePageEvent>();
  protected readonly isWeb = toSignal(inject(IS_WEB));
  protected readonly isMobile = toSignal(inject(IS_XSMALL));

  dialogRef: DynamicDialogRef | null = null;
  readonly #dialogService = inject(DialogService);

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

  tableData: LinkTableModel[] = [
    {
      linkName: 'name',
      sharedComponents: 'Project name',
      createdDate: new Date(),
      createdBy: 'Igor',
      anonymous: false,
      link: 'www.facebook.com',
    },
    {
      linkName: 'name',
      sharedComponents: 'Project name',
      createdDate: new Date(),
      createdBy: 'Igor',
      anonymous: false,
      link: 'www.facebook.com',
    },
    {
      linkName: 'name',
      sharedComponents: 'Project name',
      createdDate: new Date(),
      createdBy: 'Igor',
      anonymous: false,
      link: 'www.facebook.com',
    },
    {
      linkName: 'name',
      sharedComponents: 'Project name',
      createdDate: new Date(),
      createdBy: 'Igor',
      anonymous: false,
      link: 'www.facebook.com',
    },
  ];

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
    this.dialogRef = this.#dialogService.open(CreateViewLinkDialogComponent, {
      width: '448px',
      focusOnShow: false,
      header: this.#translateService.instant('project.contributors.createLinkDialog.dialogTitle'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
