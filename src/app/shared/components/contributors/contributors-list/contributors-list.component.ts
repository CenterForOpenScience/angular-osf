import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  EducationHistoryDialogComponent,
  EmploymentHistoryDialogComponent,
  SelectComponent,
} from '@osf/shared/components';
import { MY_PROJECTS_TABLE_PARAMS, PERMISSION_OPTIONS } from '@osf/shared/constants';
import { ContributorModel, SelectOption, TableParameters } from '@osf/shared/models';

@Component({
  selector: 'osf-contributors-list',
  imports: [TranslatePipe, FormsModule, TableModule, Tooltip, Checkbox, Skeleton, Button, SelectComponent],
  templateUrl: './contributors-list.component.html',
  styleUrl: './contributors-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ContributorsListComponent {
  contributors = input<ContributorModel[]>([]);
  isLoading = input(false);
  showCuratorColumn = input(false);

  remove = output<ContributorModel>();

  dialogService = inject(DialogService);
  translateService = inject(TranslateService);

  protected readonly tableParams = signal<TableParameters>({ ...MY_PROJECTS_TABLE_PARAMS });
  protected readonly permissionsOptions: SelectOption[] = PERMISSION_OPTIONS;

  skeletonData: ContributorModel[] = Array.from({ length: 3 }, () => ({}) as ContributorModel);

  protected removeContributor(contributor: ContributorModel) {
    this.remove.emit(contributor);
  }

  protected openEducationHistory(contributor: ContributorModel) {
    this.dialogService.open(EducationHistoryDialogComponent, {
      width: '552px',
      data: contributor.education,
      focusOnShow: false,
      header: this.translateService.instant('project.contributors.table.headers.education'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  protected openEmploymentHistory(contributor: ContributorModel) {
    this.dialogService.open(EmploymentHistoryDialogComponent, {
      width: '552px',
      data: contributor.employment,
      focusOnShow: false,
      header: this.translateService.instant('project.contributors.table.headers.employment'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
