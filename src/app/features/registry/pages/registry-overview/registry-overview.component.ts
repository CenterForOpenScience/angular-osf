import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';
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

import { OverviewToolbarComponent } from '@osf/features/project/overview/components';
import { CreateSchemaResponse, FetchAllSchemaResponses, RegistriesSelectors } from '@osf/features/registries/store';
import {
  DataResourcesComponent,
  LoadingSpinnerComponent,
  RegistrationBlocksDataComponent,
  ResourceMetadataComponent,
  SubHeaderComponent,
  ViewOnlyLinkMessageComponent,
} from '@osf/shared/components';
import { RegistrationReviewStates, ResourceType, RevisionReviewStates } from '@osf/shared/enums';
import { hasViewOnlyParam, toCamelCase } from '@osf/shared/helpers';
import { MapRegistryOverview } from '@osf/shared/mappers';
import { SchemaResponse, ToolbarResource } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';
import { FetchSelectedSubjects, GetBookmarksCollectionId, SubjectsSelectors } from '@osf/shared/stores';

import { ArchivingMessageComponent, RegistryRevisionsComponent, RegistryStatusesComponent } from '../../components';
import { RegistryMakeDecisionComponent } from '../../components/registry-make-decision/registry-make-decision.component';
import { WithdrawnMessageComponent } from '../../components/withdrawn-message/withdrawn-message.component';
import {
  GetRegistryById,
  GetRegistryInstitutions,
  GetRegistryReviewActions,
  RegistryOverviewSelectors,
  SetRegistryCustomCitation,
} from '../../store/registry-overview';

@Component({
  selector: 'osf-registry-overview',
  imports: [
    SubHeaderComponent,
    OverviewToolbarComponent,
    LoadingSpinnerComponent,
    ResourceMetadataComponent,
    RegistryRevisionsComponent,
    RegistryStatusesComponent,
    DataResourcesComponent,
    ArchivingMessageComponent,
    TranslatePipe,
    WithdrawnMessageComponent,
    RegistrationBlocksDataComponent,
    Message,
    DatePipe,
    ViewOnlyLinkMessageComponent,
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);

  readonly registry = select(RegistryOverviewSelectors.getRegistry);
  readonly isRegistryLoading = select(RegistryOverviewSelectors.isRegistryLoading);
  readonly isAnonymous = select(RegistryOverviewSelectors.isRegistryAnonymous);
  readonly subjects = select(SubjectsSelectors.getSelectedSubjects);
  readonly areSubjectsLoading = select(SubjectsSelectors.areSelectedSubjectsLoading);
  readonly institutions = select(RegistryOverviewSelectors.getInstitutions);
  readonly isInstitutionsLoading = select(RegistryOverviewSelectors.isInstitutionsLoading);
  readonly schemaBlocks = select(RegistryOverviewSelectors.getSchemaBlocks);
  readonly isSchemaBlocksLoading = select(RegistryOverviewSelectors.isSchemaBlocksLoading);
  readonly areReviewActionsLoading = select(RegistryOverviewSelectors.areReviewActionsLoading);
  readonly currentRevision = select(RegistriesSelectors.getSchemaResponse);
  readonly isSchemaResponseLoading = select(RegistriesSelectors.getSchemaResponseLoading);

  readonly hasWriteAccess = select(RegistryOverviewSelectors.hasWriteAccess);
  readonly hasAdminAccess = select(RegistryOverviewSelectors.hasAdminAccess);
  readonly hasNoPermissions = select(RegistryOverviewSelectors.hasNoPermissions);

  revisionInProgress: SchemaResponse | undefined;

  isLoading = computed(
    () =>
      this.isRegistryLoading() ||
      this.isInstitutionsLoading() ||
      this.isSchemaBlocksLoading() ||
      this.isSchemaResponseLoading() ||
      this.areSubjectsLoading()
  );

  canMakeDecision = computed(() => {
    return !this.registry()?.archiving && !this.registry()?.withdrawn && this.isModeration;
  });

  isRootRegistration = computed(() => {
    const rootId = this.registry()?.rootParentId;
    return !rootId || rootId === this.registry()?.id;
  });

  private registryId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));

  readonly schemaResponse = computed(() => {
    const registry = this.registry();
    const index = this.selectedRevisionIndex();
    this.revisionInProgress = registry?.schemaResponses.find(
      (r) => r.reviewsState === RevisionReviewStates.RevisionInProgress
    );

    const schemaResponses =
      (this.isModeration
        ? registry?.schemaResponses
        : registry?.schemaResponses.filter(
            (r) => r.reviewsState === RevisionReviewStates.Approved || this.hasAdminAccess()
          )) || [];

    if (index !== null) {
      return schemaResponses[index];
    }
    return null;
  });

  readonly updatedFields = computed(() => {
    const schemaResponse = this.schemaResponse();
    if (schemaResponse) {
      return schemaResponse.updatedResponseKeys || [];
    }
    return [];
  });

  readonly resourceOverview = computed(() => {
    const registry = this.registry();
    const subjects = this.subjects();
    const institutions = this.institutions();

    if (registry && subjects && institutions) {
      return MapRegistryOverview(registry, subjects, institutions, this.isAnonymous());
    }

    return null;
  });

  readonly selectedRevisionIndex = signal(0);

  showToolbar = computed(() => !this.registry()?.archiving && !this.registry()?.withdrawn && !this.hasNoPermissions());

  toolbarResource = computed(() => {
    if (this.registry()) {
      return {
        id: this.registry()!.id,
        title: this.registry()?.title,
        isPublic: this.registry()!.isPublic,
        storage: undefined,
        viewOnlyLinksCount: 0,
        forksCount: this.registry()!.forksCount,
        resourceType: ResourceType.Registration,
        isAnonymous: this.isAnonymous(),
      } as ToolbarResource;
    }
    return null;
  });

  private readonly actions = createDispatchMap({
    getRegistryById: GetRegistryById,
    getBookmarksId: GetBookmarksCollectionId,
    getSubjects: FetchSelectedSubjects,
    getInstitutions: GetRegistryInstitutions,
    setCustomCitation: SetRegistryCustomCitation,
    getRegistryReviewActions: GetRegistryReviewActions,
    getSchemaResponse: FetchAllSchemaResponses,
    createSchemaResponse: CreateSchemaResponse,
  });

  revisionId: string | null = null;
  isModeration = false;

  userPermissions = computed(() => this.registry()?.currentUserPermissions || []);
  hasViewOnly = computed(() => hasViewOnlyParam(this.router));

  get isInitialState(): boolean {
    return this.registry()?.reviewsState === RegistrationReviewStates.Initial;
  }

  constructor() {
    effect(() => {
      const registry = this.registry();

      if (registry && !registry?.withdrawn) {
        this.actions.getSubjects(registry?.id, ResourceType.Registration);
        this.actions.getInstitutions(registry?.id);
      }
    });

    effect(() => {
      if (this.registryId()) {
        this.actions.getRegistryById(this.registryId());
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

  navigateToFile(fileId: string): void {
    this.router.navigate(['/files', fileId]);
  }

  openRevision(revisionIndex: number): void {
    this.selectedRevisionIndex.set(revisionIndex);
  }

  onCustomCitationUpdated(citation: string): void {
    this.actions.setCustomCitation(citation);
  }

  onUpdateRegistration(id: string): void {
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
    const { id, unapproved } = {
      id: this.registry()?.id || '',
      unapproved: this.revisionInProgress?.reviewsState === RevisionReviewStates.Unapproved,
    };
    this.actions
      .getSchemaResponse(id)
      .pipe(
        tap(() => {
          if (unapproved) {
            this.navigateToJustificationReview();
          } else {
            this.navigateToJustificationPage();
          }
        })
      )
      .subscribe();
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
    const dialogWidth = '600px';
    this.actions
      .getRegistryReviewActions(this.registry()?.id || '')
      .pipe(
        switchMap(() =>
          this.dialogService
            .open(RegistryMakeDecisionComponent, {
              width: dialogWidth,
              focusOnShow: false,
              header: this.translateService.instant('moderation.makeDecision.header'),
              closeOnEscape: true,
              modal: true,
              closable: true,
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
