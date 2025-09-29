import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModeratorPermission } from '@osf/features/moderation/enums';
import { EducationHistoryDialogComponent } from '@osf/shared/components/education-history-dialog/education-history-dialog.component';
import { EmploymentHistoryDialogComponent } from '@osf/shared/components/employment-history-dialog/employment-history-dialog.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { DEFAULT_TABLE_PARAMS, PERMISSION_OPTIONS } from '@osf/shared/constants';
import { ContributorPermission } from '@osf/shared/enums';
import { ContributorModel, SelectOption, TableParameters } from '@osf/shared/models';
import { CustomDialogService } from '@osf/shared/services';

import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'osf-contributors-table',
  imports: [
    TranslatePipe,
    FormsModule,
    TableModule,
    Tooltip,
    Checkbox,
    Skeleton,
    Button,
    SelectComponent,
    IconComponent,
  ],
  templateUrl: './contributors-table.component.html',
  styleUrl: './contributors-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsTableComponent {
  contributors = model<ContributorModel[]>([]);
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

  customDialogService = inject(CustomDialogService);

  readonly tableParams = signal<TableParameters>({ ...DEFAULT_TABLE_PARAMS });
  readonly permissionsOptions: SelectOption[] = PERMISSION_OPTIONS;
  readonly ModeratorPermission = ModeratorPermission;
  readonly ContributorPermission = ContributorPermission;

  skeletonData: ContributorModel[] = Array.from({ length: 3 }, () => ({}) as ContributorModel);

  removeContributor(contributor: ContributorModel) {
    this.remove.emit(contributor);
  }

  openEducationHistory(contributor: ContributorModel) {
    this.customDialogService.open(EducationHistoryDialogComponent, {
      header: 'project.contributors.table.headers.education',
      width: '552px',
      data: contributor.education,
    });
  }

  openEmploymentHistory(contributor: ContributorModel) {
    this.customDialogService.open(EmploymentHistoryDialogComponent, {
      header: 'project.contributors.table.headers.employment',
      width: '552px',
      data: contributor.employment,
    });
  }

  onRowReorder() {
    const reorderedContributors = this.contributors().map((item, i) => ({ ...item, index: i }));
    this.contributors.set(reorderedContributors);
  }
}
