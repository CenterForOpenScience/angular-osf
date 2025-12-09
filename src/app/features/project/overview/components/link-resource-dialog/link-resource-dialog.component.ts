import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { Checkbox } from 'primeng/checkbox';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';
import { TableModule, TablePageEvent } from 'primeng/table';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';

import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { ResourceSearchMode } from '@osf/shared/enums/resource-search-mode.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { GetMyProjects, GetMyRegistrations, MyResourcesSelectors } from '@osf/shared/stores/my-resources';
import { CreateNodeLink, DeleteNodeLink, NodeLinksSelectors } from '@osf/shared/stores/node-links';
import { MyResourcesItem } from '@shared/models/my-resources/my-resources.models';
import { MyResourcesSearchFilters } from '@shared/models/my-resources/my-resources-search-filters.models';
import { TableParameters } from '@shared/models/table-parameters.model';

import { ProjectOverviewSelectors } from '../../store';

@Component({
  selector: 'osf-link-resource-dialog',
  imports: [
    SearchInputComponent,
    TranslatePipe,
    ButtonGroupModule,
    Button,
    NgClass,
    Skeleton,
    TableModule,
    DatePipe,
    Checkbox,
    FormsModule,
  ],
  templateUrl: './link-resource-dialog.component.html',
  styleUrl: './link-resource-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkResourceDialogComponent {
  private readonly destroyRef = inject(DestroyRef);
  readonly tableRows = 6;
  readonly dialogRef = inject(DynamicDialogRef);
  readonly ResourceSearchMode = ResourceSearchMode;
  readonly ResourceType = ResourceType;

  currentPage = signal(1);
  searchMode = signal<ResourceSearchMode>(ResourceSearchMode.User);
  resourceType = signal<ResourceType>(ResourceType.Project);
  searchControl = new FormControl('');

  skeletonData: MyResourcesItem[] = Array.from({ length: this.tableRows }, () => ({}) as MyResourcesItem);

  myProjects = select(MyResourcesSelectors.getProjects);
  isMyProjectsLoading = select(MyResourcesSelectors.getProjectsLoading);
  myRegistrations = select(MyResourcesSelectors.getRegistrations);
  isMyRegistrationsLoading = select(MyResourcesSelectors.getRegistrationsLoading);
  totalProjectsCount = select(MyResourcesSelectors.getTotalProjects);
  totalRegistrationsCount = select(MyResourcesSelectors.getTotalRegistrations);
  isNodeLinksSubmitting = select(NodeLinksSelectors.getNodeLinksSubmitting);
  linkedResources = select(NodeLinksSelectors.getLinkedResources);
  hasChanges = select(NodeLinksSelectors.getNodeLinksHasChanges);
  currentProject = select(ProjectOverviewSelectors.getProject);

  currentResourceId = computed(() => this.currentProject()?.id);

  currentTableItems = computed(() => {
    const items = this.resourceType() === ResourceType.Project ? this.myProjects() : this.myRegistrations();
    const currentId = this.currentResourceId();
    return currentId ? items.filter((item) => item.id !== currentId) : items;
  });

  isCurrentTableLoading = computed(() =>
    this.resourceType() === ResourceType.Project ? this.isMyProjectsLoading() : this.isMyRegistrationsLoading()
  );

  currentTotalCount = computed(() =>
    this.resourceType() === ResourceType.Project ? this.totalProjectsCount() : this.totalRegistrationsCount()
  );

  tableParams = computed<TableParameters>(() => ({
    ...DEFAULT_TABLE_PARAMS,
    rows: this.tableRows,
    firstRowIndex: (this.currentPage() - 1) * this.tableRows,
    paginator: this.currentTotalCount() > this.tableRows,
    totalRecords: this.currentTotalCount(),
  }));

  linkedResourceIds = computed(() => {
    const linkedResources = this.linkedResources();
    return new Set(linkedResources.map((resource) => resource.id));
  });

  actions = createDispatchMap({
    getProjects: GetMyProjects,
    getRegistrations: GetMyRegistrations,
    createNodeLink: CreateNodeLink,
    deleteNodeLink: DeleteNodeLink,
  });

  constructor() {
    this.setupSearchEffect();
    this.setupSearchSubscription();
  }

  onSearchModeChange(mode: ResourceSearchMode): void {
    this.searchMode.set(mode);
    this.resetToFirstPage();
  }

  onObjectTypeChange(type: ResourceType): void {
    this.resourceType.set(type);
    this.resetToFirstPage();
  }

  onPageChange(event: TablePageEvent): void {
    const newPage = Math.floor(event.first / event.rows) + 1;
    this.currentPage.set(newPage);
    this.handleSearch(this.searchControl.value || '', this.searchMode(), this.resourceType());
  }

  isItemLinked(itemId: string): boolean {
    return this.linkedResourceIds().has(itemId);
  }

  private resetToFirstPage(): void {
    this.currentPage.set(1);
  }

  setupSearchEffect() {
    effect(() => {
      this.resetToFirstPage();
      this.handleSearch(this.searchControl.value || '', this.searchMode(), this.resourceType());
    });
  }

  setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchValue) => {
        this.resetToFirstPage();
        this.handleSearch(searchValue ?? '', this.searchMode(), this.resourceType());
      });
  }

  handleCloseDialog() {
    this.dialogRef.close({ hasChanges: this.hasChanges() });
  }

  handleToggleNodeLink(resource: MyResourcesItem) {
    const currentResourceId = this.currentResourceId();

    if (!currentResourceId) {
      return;
    }

    const isCurrentlyLinked = this.isItemLinked(resource.id);

    if (isCurrentlyLinked) {
      const resources = this.linkedResources();
      const linkToDelete = resources.find((component) => component.id === resource.id);

      if (!linkToDelete) return;

      this.actions.deleteNodeLink(currentResourceId, linkToDelete);
    } else {
      this.actions.createNodeLink(currentResourceId, resource);
    }
  }

  private handleSearch(searchValue: string, searchMode: ResourceSearchMode, resourceType: ResourceType): void {
    const searchFilters: MyResourcesSearchFilters = {
      searchValue,
      searchFields: ['title', 'tags', 'description'],
    };

    untracked(() => {
      const currentResourceId = this.currentResourceId();
      if (!currentResourceId) return;

      if (resourceType === ResourceType.Project) {
        this.actions.getProjects(this.currentPage(), this.tableRows, searchFilters, searchMode, undefined);
      } else if (resourceType === ResourceType.Registration) {
        this.actions.getRegistrations(this.currentPage(), this.tableRows, searchFilters, searchMode, undefined);
      }
    });
  }
}
