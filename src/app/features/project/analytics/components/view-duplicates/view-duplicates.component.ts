import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Menu } from 'primeng/menu';
import { PaginatorState } from 'primeng/paginator';

import { map, of } from 'rxjs';

import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DeleteComponentDialogComponent, ForkDialogComponent } from '@osf/features/project/overview/components';
import { ClearProjectOverview, GetProjectById, ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import {
  ClearRegistryOverview,
  GetRegistryById,
  RegistryOverviewSelectors,
} from '@osf/features/registry/store/registry-overview';
import {
  CustomPaginatorComponent,
  IconComponent,
  LoadingSpinnerComponent,
  SubHeaderComponent,
  TruncatedTextComponent,
} from '@shared/components';
import { ResourceType, UserPermissions } from '@shared/enums';
import { IS_SMALL } from '@shared/helpers';
import { ToolbarResource } from '@shared/models';
import { ClearDuplicates, DuplicatesSelectors, GetAllDuplicates } from '@shared/stores';

@Component({
  selector: 'osf-view-duplicates',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    Button,
    Menu,
    TruncatedTextComponent,
    DatePipe,
    LoadingSpinnerComponent,
    RouterLink,
    CustomPaginatorComponent,
    IconComponent,
  ],
  templateUrl: './view-duplicates.component.html',
  styleUrl: './view-duplicates.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ViewDuplicatesComponent {
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  protected currentPage = signal<string>('1');
  protected isSmall = toSignal(inject(IS_SMALL));
  protected readonly pageSize = 10;
  protected readonly UserPermissions = UserPermissions;
  protected firstIndex = computed(() => (parseInt(this.currentPage()) - 1) * this.pageSize);
  private project = select(ProjectOverviewSelectors.getProject);
  private registration = select(RegistryOverviewSelectors.getRegistry);
  protected duplicates = select(DuplicatesSelectors.getDuplicates);
  protected isDuplicatesLoading = select(DuplicatesSelectors.getDuplicatesLoading);
  protected totalDuplicates = select(DuplicatesSelectors.getDuplicatesTotalCount);

  protected readonly forkActionItems = (resourceId: string) => [
    {
      label: 'project.overview.actions.manageContributors',
      command: () => this.router.navigate(['/project', resourceId, 'contributors']),
    },
    {
      label: 'project.overview.actions.settings',
      command: () => this.router.navigate(['/project', resourceId, 'settings']),
    },
    {
      label: 'project.overview.actions.delete',
      command: () => this.handleDeleteFork(resourceId),
    },
  ];

  readonly resourceId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));
  readonly resourceType: Signal<ResourceType | undefined> = toSignal(
    this.route.data.pipe(map((params) => params['resourceType'])) ?? of(undefined)
  );
  readonly currentResource = computed(() => {
    const resourceType = this.resourceType();

    if (resourceType) {
      if (resourceType === ResourceType.Project) return this.project();

      if (resourceType === ResourceType.Registration) return this.registration();
    }

    return null;
  });

  protected actions = createDispatchMap({
    getProject: GetProjectById,
    getRegistration: GetRegistryById,
    getDuplicates: GetAllDuplicates,
    clearDuplicates: ClearDuplicates,
    clearProject: ClearProjectOverview,
    clearRegistration: ClearRegistryOverview,
  });

  constructor() {
    effect(() => {
      const resourceId = this.resourceId();
      const resourceType = this.resourceType();

      if (resourceId) {
        if (resourceType === ResourceType.Project) this.actions.getProject(resourceId);
        if (resourceType === ResourceType.Registration) this.actions.getRegistration(resourceId);
      }
    });

    effect(() => {
      const resource = this.currentResource();

      if (resource) {
        this.actions.getDuplicates(resource.id, resource.type, parseInt(this.currentPage()), this.pageSize);
      }
    });

    this.setupCleanup();
  }

  protected toolbarResource = computed(() => {
    const resource = this.currentResource();
    const resourceType = this.resourceType();
    if (resource && resourceType) {
      return {
        id: resource.id,
        isPublic: resource.isPublic,
        storage: undefined,
        viewOnlyLinksCount: 0,
        forksCount: resource.forksCount,
        resourceType: resourceType,
      } as ToolbarResource;
    }
    return null;
  });

  protected handleForkResource(): void {
    const toolbarResource = this.toolbarResource();
    const dialogWidth = !this.isSmall() ? '95vw' : '450px';

    if (toolbarResource) {
      const dialogRef = this.dialogService.open(ForkDialogComponent, {
        width: dialogWidth,
        focusOnShow: false,
        header: this.translateService.instant('project.overview.dialog.fork.headerProject'),
        closeOnEscape: true,
        modal: true,
        closable: true,
        data: {
          resource: toolbarResource,
          resourceType: this.resourceType(),
        },
      });

      dialogRef.onClose.subscribe((result) => {
        if (result.success) {
          const resource = this.currentResource();
          if (resource) {
            this.actions.getDuplicates(resource.id, resource.type, parseInt(this.currentPage()), this.pageSize);
          }
        }
      });
    }
  }

  onPageChange(event: PaginatorState): void {
    if (event.page !== undefined) {
      const pageNumber = (event.page + 1).toString();
      this.currentPage.set(pageNumber);
    }
  }

  setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.actions.clearDuplicates();
      this.actions.clearProject();
      this.actions.clearRegistration();
    });
  }

  private handleDeleteFork(id: string): void {
    const dialogWidth = !this.isSmall() ? '95vw' : '650px';

    const dialogRef = this.dialogService.open(DeleteComponentDialogComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('project.overview.dialog.deleteComponent.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        componentId: id,
        resourceType: this.resourceType(),
        isForksContext: true,
        currentPage: parseInt(this.currentPage()),
        pageSize: this.pageSize,
      },
    });

    dialogRef.onClose.subscribe((result) => {
      if (result && result.success) {
        const resource = this.currentResource();
        if (resource) {
          this.actions.getDuplicates(resource.id, resource.type, parseInt(this.currentPage()), this.pageSize);
        }
      }
    });
  }
}
