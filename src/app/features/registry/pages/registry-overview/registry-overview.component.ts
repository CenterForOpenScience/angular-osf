import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, HostBinding, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { GetBookmarksCollectionId } from '@osf/features/collections/store';
import { OverviewToolbarComponent } from '@osf/features/project/overview/components';
import {
  GetRegistryById,
  GetRegistryInstitutions,
  GetRegistrySubjects,
  RegistryOverviewSelectors,
} from '@osf/features/registry/store/registry-overview';
import { LoadingSpinnerComponent, ResourceMetadataComponent, SubHeaderComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { MapRegistryOverview } from '@shared/mappers';
import { ToolbarResource } from '@shared/models';

@Component({
  selector: 'osf-registry-overview',
  imports: [
    SubHeaderComponent,
    OverviewToolbarComponent,
    LoadingSpinnerComponent,
    TranslatePipe,
    RouterLink,
    AccordionContent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    ResourceMetadataComponent,
    Button,
  ],
  templateUrl: './registry-overview.component.html',
  styleUrl: './registry-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class RegistryOverviewComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly registry = select(RegistryOverviewSelectors.getRegistry);
  protected readonly isRegistryLoading = select(RegistryOverviewSelectors.isRegistryLoading);
  protected readonly subjects = select(RegistryOverviewSelectors.getSubjects);
  protected readonly isSubjectsLoading = select(RegistryOverviewSelectors.isSubjectsLoading);
  protected readonly institutions = select(RegistryOverviewSelectors.getInstitutions);
  protected readonly isInstitutionsLoading = select(RegistryOverviewSelectors.isInstitutionsLoading);
  protected readonly schemaBlocks = select(RegistryOverviewSelectors.getSchemaBlocks);
  protected readonly isSchemaBlocksLoading = select(RegistryOverviewSelectors.isSchemaBlocksLoading);

  protected readonly resourceOverview = computed(() => {
    const registry = this.registry();
    const subjects = this.subjects();
    const institutions = this.institutions();
    if (registry && subjects && institutions) {
      return MapRegistryOverview(registry, subjects, institutions);
    }
    return null;
  });

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
    getSubjects: GetRegistrySubjects,
    getInstitutions: GetRegistryInstitutions,
  });

  constructor() {
    this.route.parent?.params.subscribe((params) => {
      const id = params['registrationId'];
      if (id) {
        this.actions.getRegistryById(id);
        this.actions.getSubjects(id);
        this.actions.getInstitutions(id);
      }
    });
    this.actions.getBookmarksId();
  }

  navigateToFile(fileId: string): void {
    this.router.navigate(['/files', fileId]);
  }
}
