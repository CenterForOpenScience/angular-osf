import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SelectComponent } from '@osf/shared/components/select/select.component';
import { PERMISSION_OPTIONS } from '@osf/shared/constants/contributors.constants';
import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ContributorModel } from '@shared/models/contributors/contributor.model';
import { SelectOption } from '@shared/models/select-option.model';
import { TableParameters } from '@shared/models/table-parameters.model';

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
  isLoadingMore = input(false);
  tableParams = input.required<TableParameters>();
  showCurator = input(false);
  showEducation = input(true);
  showEmployment = input(true);
  showInfo = input(false);
  resourceType = input(ResourceType.Project);

  currentUserId = input<string | undefined>(undefined);
  hasAdminAccess = input<boolean>(true);

  remove = output<ContributorModel>();
  loadMore = output<void>();

  customDialogService = inject(CustomDialogService);

  readonly permissionsOptions: SelectOption[] = PERMISSION_OPTIONS;
  readonly ContributorPermission = ContributorPermission;

  skeletonData: ContributorModel[] = Array.from({ length: 3 }, () => ({}) as ContributorModel);

  isProject = computed(() => this.resourceType() === ResourceType.Project);

  deactivatedContributors = computed(() => this.contributors().some((contributor) => contributor.deactivated));

  showLoadMore = computed(() => {
    const currentLoadedItems = this.contributors().length;
    const totalRecords = this.tableParams().totalRecords;
    return currentLoadedItems > 0 && currentLoadedItems < totalRecords;
  });

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

  loadMoreItems() {
    this.loadMore.emit();
  }
}
