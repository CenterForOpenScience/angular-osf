import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { Checkbox, CheckboxChangeEvent } from 'primeng/checkbox';
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

import { SearchInputComponent } from '@osf/shared/components';
import { ResourceSearchMode, ResourceType } from '@osf/shared/enums';
import { MyResourcesItem, MyResourcesSearchFilters } from '@osf/shared/models';
import {
  CreateNodeLink,
  DeleteNodeLink,
  GetLinkedResources,
  GetMyProjects,
  GetMyRegistrations,
  MyResourcesSelectors,
  NodeLinksSelectors,
} from '@osf/shared/stores';

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

  currentProject = select(ProjectOverviewSelectors.getProject);
  myProjects = select(MyResourcesSelectors.getProjects);
  isMyProjectsLoading = select(MyResourcesSelectors.getProjectsLoading);
  myRegistrations = select(MyResourcesSelectors.getRegistrations);
  isMyRegistrationsLoading = select(MyResourcesSelectors.getRegistrationsLoading);
  totalProjectsCount = select(MyResourcesSelectors.getTotalProjects);
  totalRegistrationsCount = select(MyResourcesSelectors.getTotalRegistrations);
  isNodeLinksSubmitting = select(NodeLinksSelectors.getNodeLinksSubmitting);
  linkedResources = select(NodeLinksSelectors.getLinkedResources);

  currentTableItems = computed(() =>
    this.resourceType() === ResourceType.Project ? this.myProjects() : this.myRegistrations()
  );

  isCurrentTableLoading = computed(() =>
    this.resourceType() === ResourceType.Project ? this.isMyProjectsLoading() : this.isMyRegistrationsLoading()
  );

  currentTotalCount = computed(() =>
    this.resourceType() === ResourceType.Project ? this.totalProjectsCount() : this.totalRegistrationsCount()
  );

  isItemLinked = computed(() => {
    const linkedResources = this.linkedResources();
    const linkedTargetIds = new Set(linkedResources.map((resource) => resource.id));

    return (itemId: string) => linkedTargetIds.has(itemId);
  });

  actions = createDispatchMap({
    getProjects: GetMyProjects,
    getRegistrations: GetMyRegistrations,
    createNodeLink: CreateNodeLink,
    deleteNodeLink: DeleteNodeLink,
    getLinkedProjects: GetLinkedResources,
  });

  constructor() {
    this.setupSearchEffect();
    this.setupSearchSubscription();
    this.setupNodeLinksEffect();
  }

  onSearchModeChange(mode: ResourceSearchMode): void {
    this.searchMode.set(mode);
    this.currentPage.set(1);
  }

  onObjectTypeChange(type: ResourceType): void {
    this.resourceType.set(type);
    this.currentPage.set(1);
  }

  onPageChange(event: TablePageEvent): void {
    const newPage = Math.floor(event.first / event.rows) + 1;
    this.currentPage.set(newPage);
    this.handleSearch(this.searchControl.value || '', this.searchMode(), this.resourceType());
  }

  setupSearchEffect() {
    effect(() => {
      this.currentPage.set(1);
      this.handleSearch(this.searchControl.value || '', this.searchMode(), this.resourceType());
    });
  }

  setupNodeLinksEffect() {
    effect(() => {
      const currentProject = this.currentProject();
      if (currentProject) {
        this.actions.getLinkedProjects(currentProject.id);
      }
    });
  }

  setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchValue) => {
        this.currentPage.set(1);
        this.handleSearch(searchValue ?? '', this.searchMode(), this.resourceType());
      });
  }

  handleCloseDialog() {
    const currentProjectId = this.currentProject()?.id;

    if (!currentProjectId) {
      this.dialogRef.close();
      return;
    }

    this.actions.getLinkedProjects(currentProjectId);
    this.dialogRef.close();
  }

  handleToggleNodeLink($event: CheckboxChangeEvent, resource: MyResourcesItem) {
    const currentProjectId = this.currentProject()?.id;

    if (!currentProjectId) {
      return;
    }

    const isCurrentlyLinked = this.isItemLinked()(resource.id);

    if (isCurrentlyLinked) {
      const resources = this.linkedResources();
      const linkToDelete = resources.find((component) => component.id === resource.id);

      if (!linkToDelete) return;

      this.actions.deleteNodeLink(currentProjectId, linkToDelete);
    } else {
      this.actions.createNodeLink(currentProjectId, resource);
    }
  }

  private handleSearch(searchValue: string, searchMode: ResourceSearchMode, resourceType: ResourceType): void {
    const searchFilters: MyResourcesSearchFilters = {
      searchValue,
      searchFields: ['title', 'tags', 'description'],
    };

    untracked(() => {
      if (resourceType === ResourceType.Project) {
        const currentProjectId = this.currentProject()?.id;
        if (!currentProjectId) return;
        this.actions.getProjects(this.currentPage(), this.tableRows, searchFilters, searchMode, currentProjectId);
      } else if (resourceType === ResourceType.Registration) {
        this.actions.getRegistrations(this.currentPage(), this.tableRows, searchFilters);
      }
    });
  }
}
