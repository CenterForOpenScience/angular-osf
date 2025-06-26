import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MY_PROJECTS_TABLE_PARAMS } from '@osf/core/constants';
import { SelectComponent } from '@osf/shared/components';
import { SelectOption, TableParameters } from '@osf/shared/models';

import { PERMISSION_OPTIONS } from '../constants';
import { ContributorModel } from '../models';

@Component({
  selector: 'osf-contributors-list',
  imports: [TranslatePipe, FormsModule, TableModule, Tooltip, Checkbox, Skeleton, Button, SelectComponent],
  templateUrl: './contributors-list.component.html',
  styleUrl: './contributors-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsListComponent {
  contributors = input<ContributorModel[]>([]);
  isLoading = input(false);

  remove = output<ContributorModel>();
  showEducationHistory = output<ContributorModel>();
  showEmploymentHistory = output<ContributorModel>();

  protected readonly tableParams = signal<TableParameters>({ ...MY_PROJECTS_TABLE_PARAMS });
  protected readonly permissionsOptions: SelectOption[] = PERMISSION_OPTIONS;

  skeletonData: ContributorModel[] = Array.from({ length: 3 }, () => ({}) as ContributorModel);

  protected removeContributor(contributor: ContributorModel) {
    this.remove.emit(contributor);
  }

  protected openEducationHistory(contributor: ContributorModel) {
    this.showEducationHistory.emit(contributor);
  }

  protected openEmploymentHistory(contributor: ContributorModel) {
    this.showEmploymentHistory.emit(contributor);
  }
}
