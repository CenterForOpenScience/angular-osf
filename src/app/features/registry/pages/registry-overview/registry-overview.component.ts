import { createDispatchMap, select } from '@ngxs/store';

import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, HostBinding, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GetBookmarksCollectionId } from '@osf/features/collections/store';
import { OverviewToolbarComponent } from '@osf/features/project/overview/components';
import { GetRegistryById, RegistryOverviewSelectors } from '@osf/features/registry/store/registry-overview';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { ToolbarResource } from '@shared/models';

@Component({
  selector: 'osf-registry-overview',
  imports: [SubHeaderComponent, OverviewToolbarComponent, LoadingSpinnerComponent],
  templateUrl: './registry-overview.component.html',
  styleUrl: './registry-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class RegistryOverviewComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  private readonly route = inject(ActivatedRoute);

  protected readonly registry = select(RegistryOverviewSelectors.getRegistry);
  protected readonly isRegistryLoading = select(RegistryOverviewSelectors.isRegistryLoading);
  protected toolbarResource = computed(() => {
    if (this.registry()) {
      return {
        id: this.registry()!.id,
        isPublic: this.registry()!.isPublic,
        storage: undefined,
        viewOnlyLinksCount: 0,
        forksCount: this.registry()!.forksCount,
        resourceType: ResourceType.Registration,
      } as ToolbarResource;
    }
    return null;
  });

  private readonly actions = createDispatchMap({
    getRegistryById: GetRegistryById,
    getBookmarksId: GetBookmarksCollectionId,
  });

  constructor() {
    this.route.parent?.params.subscribe((params) => {
      const id = params['registrationId'];
      if (id) {
        this.actions.getRegistryById(id);
      }
    });
    this.actions.getBookmarksId();
  }
}
