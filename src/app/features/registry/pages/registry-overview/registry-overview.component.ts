import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Message } from 'primeng/message';

import { map, of, switchMap, tap } from 'rxjs';

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
import { hasViewOnlyParam } from '@osf/shared/helpers/view-only.helper';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { GetBookmarksCollectionId } from '@osf/shared/stores/bookmarks';
import { ContributorsSelectors, GetBibliographicContributors } from '@osf/shared/stores/contributors';
import { SchemaResponse } from '@shared/models/registration/schema-response.model';

import {
  ArchivingMessageComponent,
  RegistryBlocksSectionComponent,
  RegistryRevisionsComponent,
  RegistryStatusesComponent,
} from '../../components';
import { RegistrationOverviewToolbarComponent } from '../../components/registration-overview-toolbar/registration-overview-toolbar.component';
import { RegistryMakeDecisionComponent } from '../../components/registry-make-decision/registry-make-decision.component';
import { RegistryOverviewMetadataComponent } from '../../components/registry-overview-metadata/registry-overview-metadata.component';
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
    SubHeaderComponent,
    LoadingSpinnerComponent,
    RegistryOverviewMetadataComponent,
    RegistryRevisionsComponent,
    RegistryStatusesComponent,
    DataResourcesComponent,
    ArchivingMessageComponent,
    TranslatePipe,
    WithdrawnMessageComponent,
    Message,
    DatePipe,
    ViewOnlyLinkMessageComponent,
    RegistrationOverviewToolbarComponent,
    RegistryBlocksSectionComponent,
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

  bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  isBibliographicContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  hasMoreBibliographicContributors = select(ContributorsSelectors.hasMoreBibliographicContributors);

  readonly hasWriteAccess = select(RegistrySelectors.hasWriteAccess);
  readonly hasAdminAccess = select(RegistrySelectors.hasAdminAccess);

  revisionInProgress: SchemaResponse | undefined;

  canMakeDecision = computed(() => !this.registry()?.archiving && !this.registry()?.withdrawn && this.isModeration);

  isRootRegistration = computed(() => {
    const rootId = this.registry()?.rootParentId;
    return !rootId || rootId === this.registry()?.id;
  });

  private registryId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));

  readonly schemaResponse = computed(() => {
    const index = this.selectedRevisionIndex();
    const schemaResponses = this.schemaResponses() || [];

    this.revisionInProgress = schemaResponses?.find((r) => r.reviewsState === RevisionReviewStates.RevisionInProgress);

    return index !== null ? schemaResponses[index] : null;
  });

  readonly selectedRevisionIndex = signal(0);

  showToolbar = computed(() => !this.registry()?.archiving && !this.registry()?.withdrawn);

  private readonly actions = createDispatchMap({
    getRegistryById: GetRegistryById,
    getBookmarksId: GetBookmarksCollectionId,
    getSchemaResponses: GetRegistrySchemaResponses,
    getSchemaBlocks: GetSchemaBlocks,
    getRegistryReviewActions: GetRegistryReviewActions,
    createSchemaResponse: CreateSchemaResponse,
    getBibliographicContributors: GetBibliographicContributors,
  });

  revisionId: string | null = null;
  isModeration = false;

  hasViewOnly = computed(() => hasViewOnlyParam(this.router));

  get isInitialState(): boolean {
    return this.registry()?.reviewsState === RegistrationReviewStates.Initial;
  }

  constructor() {
    effect(() => {
      const registry = this.registry();

      if (registry?.id && !registry?.withdrawn) {
        this.actions.getSchemaBlocks(registry.registrationSchemaLink);
        this.actions.getSchemaResponses(registry?.id);
      }
    });

    effect(() => {
      if (this.registryId()) {
        this.actions.getRegistryById(this.registryId());
        this.actions.getBibliographicContributors(this.registryId(), ResourceType.Registration);
      }
    });

    this.actions.getBookmarksId();

    this.route.queryParams
      .pipe(
        takeUntilDestroyed(),
        map((params) => ({ revisionId: params['revisionId'], mode: params['mode'] })),
        tap(({ revisionId, mode }) => {
          this.revisionId = revisionId;
          this.isModeration = mode === 'moderator';
        })
      )
      .subscribe();
  }

  openRevision(revisionIndex: number): void {
    this.selectedRevisionIndex.set(revisionIndex);
  }

  onUpdateRegistration(id: string): void {
    this.loaderService.show();

    this.actions
      .createSchemaResponse(id)
      .pipe(
        tap(() => {
          this.revisionInProgress = this.currentRevision()!;
          this.navigateToJustificationPage();
        })
      )
      .subscribe();
  }

  onContinueUpdateRegistration(): void {
    const unapproved = this.revisionInProgress?.reviewsState === RevisionReviewStates.Unapproved;

    if (unapproved) {
      this.navigateToJustificationReview();
    } else {
      this.navigateToJustificationPage();
    }
  }

  private navigateToJustificationPage(): void {
    const revisionId = this.revisionId || this.revisionInProgress?.id;
    this.router.navigate([`/registries/revisions/${revisionId}/justification`]);
  }

  private navigateToJustificationReview(): void {
    const revisionId = this.revisionId || this.revisionInProgress?.id;
    this.router.navigate([`/registries/revisions/${revisionId}/review`]);
  }

  handleOpenMakeDecisionDialog() {
    this.actions
      .getRegistryReviewActions(this.registry()?.id || '')
      .pipe(
        switchMap(() =>
          this.customDialogService
            .open(RegistryMakeDecisionComponent, {
              header: 'moderation.makeDecision.header',
              width: '600px',
              data: {
                registry: this.registry(),
                revisionId: this.revisionId,
              },
            })
            .onClose.pipe(takeUntilDestroyed(this.destroyRef))
        )
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

          this.actions.getRegistryById(this.registry()?.id || '');
        }
      });
  }
}
