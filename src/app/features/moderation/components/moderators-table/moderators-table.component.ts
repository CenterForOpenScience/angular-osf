import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { TableModule, TablePageEvent } from 'primeng/table';

import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MODERATION_PERMISSIONS } from '@osf/features/moderation/constants';
import { ModeratorPermission } from '@osf/features/moderation/enums';
import { ModeratorModel } from '@osf/features/moderation/models';
import {
  EducationHistoryDialogComponent,
  EmploymentHistoryDialogComponent,
  SelectComponent,
} from '@osf/shared/components';
import { TableParameters } from '@osf/shared/models';
import { CustomDialogService } from '@osf/shared/services';

@Component({
  selector: 'osf-moderators-table',
  imports: [TranslatePipe, FormsModule, TableModule, Skeleton, Button, SelectComponent, RouterLink],
  templateUrl: './moderators-table.component.html',
  styleUrl: './moderators-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeratorsTableComponent {
  items = input<ModeratorModel[]>([]);
  isLoading = input(false);
  tableParams = input.required<TableParameters>();
  currentUserId = input.required<string | undefined>();
  isCurrentUserAdminModerator = input.required<boolean>();

  update = output<ModeratorModel>();
  remove = output<ModeratorModel>();
  pageChanged = output<TablePageEvent>();

  customDialogService = inject(CustomDialogService);

  readonly permissionsOptions = MODERATION_PERMISSIONS;
  readonly ModeratorPermission = ModeratorPermission;

  skeletonData: ModeratorModel[] = Array.from({ length: 3 }, () => ({}) as ModeratorModel);

  onPageChange(event: TablePageEvent): void {
    this.pageChanged.emit(event);
  }

  updatePermission(item: ModeratorModel) {
    this.update.emit(item);
  }

  removeModerator(item: ModeratorModel) {
    this.remove.emit(item);
  }

  openEducationHistory(contributor: ModeratorModel) {
    this.customDialogService.open(EducationHistoryDialogComponent, {
      header: 'project.contributors.table.headers.education',
      width: '552px',
      data: contributor.education,
    });
  }

  openEmploymentHistory(contributor: ModeratorModel) {
    this.customDialogService.open(EmploymentHistoryDialogComponent, {
      header: 'project.contributors.table.headers.employment',
      width: '552px',
      data: contributor.employment,
    });
  }
}
