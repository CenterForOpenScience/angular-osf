import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PERMISSION_OPTIONS } from '@osf/shared/constants';
import { ResourceType } from '@osf/shared/enums';
import { ContributorModel, SelectOption } from '@osf/shared/models';
import { CustomDialogService } from '@osf/shared/services';

import { EducationHistoryDialogComponent } from '../../education-history-dialog/education-history-dialog.component';
import { EmploymentHistoryDialogComponent } from '../../employment-history-dialog/employment-history-dialog.component';
import { SelectComponent } from '../../select/select.component';

@Component({
  selector: 'osf-request-access-table',
  imports: [TranslatePipe, TableModule, Tooltip, Skeleton, Button, SelectComponent, Checkbox, FormsModule],
  templateUrl: './request-access-table.component.html',
  styleUrl: './request-access-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestAccessTableComponent {
  contributors = input.required<ContributorModel[]>();
  isLoading = input(false);
  resourceType = input(ResourceType.Project);
  showEmployment = input(true);
  showEducation = input(true);
  showInfo = input(true);

  accept = output<ContributorModel>();
  reject = output<ContributorModel>();

  customDialogService = inject(CustomDialogService);

  readonly permissionsOptions: SelectOption[] = PERMISSION_OPTIONS;

  skeletonData: ContributorModel[] = Array.from({ length: 3 }, () => ({}) as ContributorModel);

  isProject = computed(() => this.resourceType() === ResourceType.Project);

  acceptContributor(contributor: ContributorModel) {
    this.accept.emit(contributor);
  }

  rejectContributor(contributor: ContributorModel) {
    this.reject.emit(contributor);
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
}
