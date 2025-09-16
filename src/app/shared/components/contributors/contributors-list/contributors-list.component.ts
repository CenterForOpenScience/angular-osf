import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModeratorPermission } from '@osf/features/moderation/enums';
import { DEFAULT_TABLE_PARAMS, PERMISSION_OPTIONS } from '@osf/shared/constants';
import { ContributorModel, SelectOption, TableParameters } from '@osf/shared/models';
import { ContributorPermission } from '@shared/enums';

import { EducationHistoryDialogComponent } from '../../education-history-dialog/education-history-dialog.component';
import { EmploymentHistoryDialogComponent } from '../../employment-history-dialog/employment-history-dialog.component';
import { SelectComponent } from '../../select/select.component';

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
  showCurator = input(false);
  showEducation = input(true);
  showEmployment = input(true);

  currentUserId = input<string | undefined>(undefined);
  isCurrentUserAdminContributor = input<boolean>(true);

  canRemoveContributor = computed(() => {
    const contributors = this.contributors();
    const currentUserId = this.currentUserId();
    const isAdmin = this.isCurrentUserAdminContributor();
    const adminCount = contributors.filter((c) => c.permission === ContributorPermission.Admin).length;

    const result = new Map<string, boolean>();

    for (const c of contributors) {
      const canRemove =
        (isAdmin || currentUserId === c.userId) && !(c.permission === ContributorPermission.Admin && adminCount <= 1);

      result.set(c.userId, canRemove);
    }

    return result;
  });

  remove = output<ContributorModel>();
  dialogService = inject(DialogService);
  translateService = inject(TranslateService);

  readonly tableParams = signal<TableParameters>({ ...DEFAULT_TABLE_PARAMS });
  readonly permissionsOptions: SelectOption[] = PERMISSION_OPTIONS;
  readonly ModeratorPermission = ModeratorPermission;
  readonly ContributorPermission = ContributorPermission;

  skeletonData: ContributorModel[] = Array.from({ length: 3 }, () => ({}) as ContributorModel);

  removeContributor(contributor: ContributorModel) {
    this.remove.emit(contributor);
  }

  openEducationHistory(contributor: ContributorModel) {
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

  openEmploymentHistory(contributor: ContributorModel) {
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
