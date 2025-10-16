import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Skeleton } from 'primeng/skeleton';
import { TableModule, TablePageEvent } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SelectComponent } from '@osf/shared/components/select/select.component';
import { PERMISSION_OPTIONS } from '@osf/shared/constants';
import { ContributorPermission, ResourceType } from '@osf/shared/enums';
import { ContributorModel, SelectOption, TableParameters } from '@osf/shared/models';
import { CustomDialogService } from '@osf/shared/services';

import { EducationHistoryDialogComponent } from '../../education-history-dialog/education-history-dialog.component';
import { EmploymentHistoryDialogComponent } from '../../employment-history-dialog/employment-history-dialog.component';
import { IconComponent } from '../../icon/icon.component';
import { InfoIconComponent } from '../../info-icon/info-icon.component';

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
    InfoIconComponent,
  ],
  templateUrl: './contributors-table.component.html',
  styleUrl: './contributors-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsTableComponent {
  contributors = model<ContributorModel[]>([]);
  isLoading = input(false);
  tableParams = input.required<TableParameters>();
  showCurator = input(false);
  showEducation = input(true);
  showEmployment = input(true);
  showInfo = input(false);
  resourceType = input(ResourceType.Project);

  currentUserId = input<string | undefined>(undefined);
  hasAdminAccess = input<boolean>(true);

  remove = output<ContributorModel>();
  pageChanged = output<TablePageEvent>();

  customDialogService = inject(CustomDialogService);

  readonly permissionsOptions: SelectOption[] = PERMISSION_OPTIONS;
  readonly ContributorPermission = ContributorPermission;

  skeletonData: ContributorModel[] = Array.from({ length: 3 }, () => ({}) as ContributorModel);

  isProject = computed(() => this.resourceType() === ResourceType.Project);

  deactivatedContributors = computed(() => this.contributors().some((contributor) => contributor.deactivated));

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
    const firstIndex = this.tableParams().firstRowIndex;
    const reorderedContributors = this.contributors().map((item, i) => ({ ...item, index: i + firstIndex }));
    this.contributors.set(reorderedContributors);
  }

  onPageChange(event: TablePageEvent): void {
    this.pageChanged.emit(event);
  }
}
