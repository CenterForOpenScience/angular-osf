import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Message } from 'primeng/message';

import { map, of, switchMap } from 'rxjs';

import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { DataResourcesComponent } from '@osf/shared/components/data-resources/data-resources.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { toCamelCase } from '@osf/shared/helpers/camel-case';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';
import { GetBookmarksCollectionId } from '@osf/shared/stores/bookmarks';
import { GetBibliographicContributors } from '@osf/shared/stores/contributors';

import { ArchivingMessageComponent } from '../../components/archiving-message/archiving-message.component';
import { RegistrationOverviewToolbarComponent } from '../../components/registration-overview-toolbar/registration-overview-toolbar.component';
import { RegistryBlocksSectionComponent } from '../../components/registry-blocks-section/registry-blocks-section.component';
import { RegistryMakeDecisionComponent } from '../../components/registry-make-decision/registry-make-decision.component';
import { RegistryOverviewMetadataComponent } from '../../components/registry-overview-metadata/registry-overview-metadata.component';
import { RegistryRevisionsComponent } from '../../components/registry-revisions/registry-revisions.component';
import { RegistryStatusesComponent } from '../../components/registry-statuses/registry-statuses.component';
import { WithdrawnMessageComponent } from '../../components/withdrawn-message/withdrawn-message.component';
import {
  CreateSchemaResponse,
  GetRegistryById,
  GetRegistryReviewActions,
  GetRegistrySchemaResponses,
  GetSchemaBlocks,
  RegistrySelectors,
} from '../../store/registry';

@Component({
  selector: 'osf-registry-overview',
  imports: [
    Message,
    SubHeaderComponent,
    LoadingSpinnerComponent,
    RegistryOverviewMetadataComponent,
    RegistryRevisionsComponent,
    RegistryStatusesComponent,
    DataResourcesComponent,
    ArchivingMessageComponent,
    WithdrawnMessageComponent,
    ViewOnlyLinkMessageComponent,
    RegistrationOverviewToolbarComponent,
    RegistryBlocksSectionComponent,
    DatePipe,
    TranslatePipe,
  ],
  templateUrl: './registry-overview.component.html',
  styleUrl: './registry-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryOverviewComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly viewOnlyService = inject(ViewOnlyLinkHelperService);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly loaderService = inject(LoaderService);

  readonly registry = select(RegistrySelectors.getRegistry);
  readonly isRegistryLoading = select(RegistrySelectors.isRegistryLoading);
  readonly isAnonymous = select(RegistrySelectors.isRegistryAnonymous);
  readonly schemaResponses = select(RegistrySelectors.getSchemaResponses);
  readonly isSchemaResponsesLoading = select(RegistrySelectors.isSchemaResponsesLoading);
  readonly schemaBlocks = select(RegistrySelectors.getSchemaBlocks);
  readonly isSchemaBlocksLoading = select(RegistrySelectors.isSchemaBlocksLoading);
  readonly areReviewActionsLoading = select(RegistrySelectors.areReviewActionsLoading);
  readonly currentRevision = select(RegistrySelectors.getSchemaResponse);
  readonly hasAdminAccess = select(RegistrySelectors.hasAdminAccess);

  readonly selectedRevisionIndex = signal(0);

  private readonly queryParams = toSignal(this.route.queryParams);
  readonly revisionId = computed(() => (this.queryParams()?.['revisionId'] as string) ?? null);
  readonly isModeration = computed(() => this.queryParams()?.['mode'] === 'moderator');

  readonly hasViewOnly = computed(() => this.viewOnlyService.hasViewOnlyParam(this.router));
  readonly showToolbar = computed(() => !this.registry()?.archiving && !this.registry()?.withdrawn);
  readonly isInitialState = computed(() => this.registry()?.reviewsState === RegistrationReviewStates.Initial);
  readonly canMakeDecision = computed(
    () => !this.registry()?.archiving && !this.registry()?.withdrawn && this.isModeration()
  );

  isRootRegistration = computed(() => {
    const rootId = this.registry()?.rootParentId;
    return !rootId || rootId === this.registry()?.id;
  });

  readonly revisionInProgress = computed(() => {
    const responses = this.schemaResponses() || [];
    return responses.find((r) => r.reviewsState === RevisionReviewStates.RevisionInProgress);
  });

  readonly schemaResponse = computed(() => {
    const index = this.selectedRevisionIndex();
    const schemaResponses = this.schemaResponses() || [];
    return index !== null ? schemaResponses[index] : null;
  });

  private readonly registryId = toSignal(
    this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined)
  );

  private readonly actions = createDispatchMap({
    getRegistryById: GetRegistryById,
    getBookmarksId: GetBookmarksCollectionId,
    getSchemaResponses: GetRegistrySchemaResponses,
    getSchemaBlocks: GetSchemaBlocks,
    getRegistryReviewActions: GetRegistryReviewActions,
    createSchemaResponse: CreateSchemaResponse,
    getBibliographicContributors: GetBibliographicContributors,
  });

  constructor() {
    effect(() => {
      const registry = this.registry();
      if (registry?.id && !registry.withdrawn) {
        this.actions.getSchemaBlocks(registry.registrationSchemaLink);
        this.actions.getSchemaResponses(registry.id);
      }
    });

    effect(() => {
      const id = this.registryId();
      if (id) {
        this.actions.getRegistryById(id);
        this.actions.getBibliographicContributors(id, ResourceType.Registration);
      }
    });

    this.actions.getBookmarksId();
  }

  openRevision(revisionIndex: number): void {
    this.selectedRevisionIndex.set(revisionIndex);
  }

  onUpdateRegistration(id: string): void {
    this.loaderService.show();
    this.actions
      .createSchemaResponse(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const revisionId = this.currentRevision()?.id;
          if (revisionId) {
            this.router.navigate([`/registries/revisions/${revisionId}/justification`]);
          }
        },
      });
  }

  onContinueUpdateRegistration(): void {
    const unapproved = this.revisionInProgress()?.reviewsState === RevisionReviewStates.Unapproved;
    if (unapproved) {
      this.navigateToRevision('review');
    } else {
      this.navigateToRevision('justification');
    }
  }

  handleOpenMakeDecisionDialog(): void {
    const registryId = this.registry()?.id;
    if (!registryId) return;

    this.actions
      .getRegistryReviewActions(registryId)
      .pipe(
        switchMap(() =>
          this.customDialogService
            .open(RegistryMakeDecisionComponent, {
              header: 'moderation.makeDecision.header',
              width: '600px',
              data: {
                registry: this.registry(),
                revisionId: this.revisionId(),
              },
            })
            .onClose.pipe(takeUntilDestroyed(this.destroyRef))
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        if (data) {
          if (data.action) {
            const action = toCamelCase(data.action);
            this.toastService.showSuccess(`moderation.makeDecision.${action}Success`);
          }

          const currentUrl = this.router.url.split('?')[0];
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });

          this.actions.getRegistryById(registryId);
        }
      });
  }

  private navigateToRevision(page: 'justification' | 'review'): void {
    const revisionId = this.revisionId() || this.revisionInProgress()?.id;
    if (!revisionId) return;
    this.router.navigate([`/registries/revisions/${revisionId}/${page}`]);
  }
}
