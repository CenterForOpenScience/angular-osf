import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MY_PROJECTS_TABLE_PARAMS } from '@osf/core/constants';
import { SelectComponent } from '@osf/shared/components';
import { TableParameters } from '@osf/shared/models';

import { MODERATION_PERMISSIONS } from '../../constants';
import { ModeratorModel } from '../../models';

@Component({
  selector: 'osf-collection-moderators-list',
  imports: [TranslatePipe, FormsModule, TableModule, Skeleton, Button, SelectComponent],
  templateUrl: './collection-moderators-list.component.html',
  styleUrl: './collection-moderators-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionModeratorsListComponent {
  items = input<ModeratorModel[]>([]);
  isLoading = input(false);

  update = output<ModeratorModel>();
  remove = output<ModeratorModel>();
  showEducationHistory = output<ModeratorModel>();
  showEmploymentHistory = output<ModeratorModel>();

  protected readonly tableParams = signal<TableParameters>({ ...MY_PROJECTS_TABLE_PARAMS });
  protected readonly permissionsOptions = MODERATION_PERMISSIONS;

  skeletonData: ModeratorModel[] = Array.from({ length: 3 }, () => ({}) as ModeratorModel);

  protected updatePermission(item: ModeratorModel) {
    this.update.emit(item);
  }

  protected removeModerator(item: ModeratorModel) {
    this.remove.emit(item);
  }

  protected openEducationHistory(item: ModeratorModel) {
    this.showEducationHistory.emit(item);
  }

  protected openEmploymentHistory(item: ModeratorModel) {
    this.showEmploymentHistory.emit(item);
  }
}
