import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MODERATION_PERMISSIONS } from '@osf/features/moderation/constants';
import { ModeratorModel } from '@osf/features/moderation/models';
import {
  EducationHistoryDialogComponent,
  EmploymentHistoryDialogComponent,
  SelectComponent,
} from '@osf/shared/components';
import { MY_PROJECTS_TABLE_PARAMS } from '@osf/shared/constants';
import { TableParameters } from '@osf/shared/models';

@Component({
  selector: 'osf-moderators-table',
  imports: [TranslatePipe, FormsModule, TableModule, Skeleton, Button, SelectComponent],
  templateUrl: './moderators-table.component.html',
  styleUrl: './moderators-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ModeratorsTableComponent {
  items = input<ModeratorModel[]>([]);
  isLoading = input(false);

  update = output<ModeratorModel>();
  remove = output<ModeratorModel>();

  dialogService = inject(DialogService);
  translateService = inject(TranslateService);

  protected readonly tableParams = signal<TableParameters>({ ...MY_PROJECTS_TABLE_PARAMS });
  protected readonly permissionsOptions = MODERATION_PERMISSIONS;

  skeletonData: ModeratorModel[] = Array.from({ length: 3 }, () => ({}) as ModeratorModel);

  protected updatePermission(item: ModeratorModel) {
    this.update.emit(item);
  }

  protected removeModerator(item: ModeratorModel) {
    this.remove.emit(item);
  }

  protected openEducationHistory(contributor: ModeratorModel) {
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

  protected openEmploymentHistory(contributor: ModeratorModel) {
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
