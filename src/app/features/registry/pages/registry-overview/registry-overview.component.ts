import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';

import { filter, map, switchMap, tap } from 'rxjs';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, HostBinding, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { OverviewToolbarComponent } from '@osf/features/project/overview/components';
import { CreateSchemaResponse, FetchAllSchemaResponses, RegistriesSelectors } from '@osf/features/registries/store';
import {
  DataResourcesComponent,
  LoadingSpinnerComponent,
  RegistrationBlocksDataComponent,
  ResourceMetadataComponent,
  SubHeaderComponent,
} from '@osf/shared/components';
import { RegistrationReviewStates, ResourceType, RevisionReviewStates, UserPermissions } from '@osf/shared/enums';
import { toCamelCase } from '@osf/shared/helpers';
import { MapRegistryOverview } from '@osf/shared/mappers';
import { SchemaResponse, ToolbarResource } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';
import { GetBookmarksCollectionId } from '@shared/stores';

import { ArchivingMessageComponent, RegistryRevisionsComponent, RegistryStatusesComponent } from '../../components';
import { RegistryMakeDecisionComponent } from '../../components/registry-make-decision/registry-make-decision.component';
import { WithdrawnMessageComponent } from '../../components/withdrawn-message/withdrawn-message.component';
import {
  GetRegistryById,
  GetRegistryInstitutions,
  GetRegistryReviewActions,
  GetRegistrySubjects,
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
  ],
  templateUrl: './registry-overview.component.html',
  styleUrl: './registry-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, DatePipe],
})
export class RegistryOverviewComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly datePipe = inject(DatePipe);

  protected readonly registry = select(RegistryOverviewSelectors.getRegistry);
  protected readonly isRegistryLoading = select(RegistryOverviewSelectors.isRegistryLoading);
  protected readonly subjects = select(RegistryOverviewSelectors.getSubjects);
  protected readonly isSubjectsLoading = select(RegistryOverviewSelectors.isSubjectsLoading);
  protected readonly institutions = select(RegistryOverviewSelectors.getInstitutions);
  protected readonly isInstitutionsLoading = select(RegistryOverviewSelectors.isInstitutionsLoading);
  protected readonly schemaBlocks = select(RegistryOverviewSelectors.getSchemaBlocks);
  protected readonly isSchemaBlocksLoading = select(RegistryOverviewSelectors.isSchemaBlocksLoading);
  protected readonly areReviewActionsLoading = select(RegistryOverviewSelectors.areReviewActionsLoading);
  protected readonly currentRevision = select(RegistriesSelectors.getSchemaResponse);
  protected readonly isSchemaResponseLoading = select(RegistriesSelectors.getSchemaResponseLoading);
  protected revisionInProgress: SchemaResponse | undefined;

  protected readonly schemaResponse = computed(() => {
    const registry = this.registry();
    const index = this.selectedRevisionIndex();
    this.revisionInProgress = registry?.schemaResponses.find(
      (r) => r.reviewsState === RevisionReviewStates.RevisionInProgress
    );
    const schemaResponses =
      (this.isModeration
        ? registry?.schemaResponses
        : registry?.schemaResponses.filter((r) => r.reviewsState === RevisionReviewStates.Approved)) || [];
    if (index !== null) {
      return schemaResponses[index];
    }
    return null;
  });

  protected readonly updatedFields = computed(() => {
    const schemaResponse = this.schemaResponse();
    if (schemaResponse) {
      return schemaResponse.updatedResponseKeys || [];
    }
    return [];
  });

  protected readonly resourceOverview = computed(() => {
    const registry = this.registry();
    const subjects = this.subjects();
    const institutions = this.institutions();
    if (registry && subjects && institutions) {
      return MapRegistryOverview(registry, subjects, institutions);
    }
    return null;
  });

  protected readonly selectedRevisionIndex = signal(0);

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
    setCustomCitation: SetRegistryCustomCitation,
    getRegistryReviewActions: GetRegistryReviewActions,
    getSchemaResponse: FetchAllSchemaResponses,
    createSchemaResponse: CreateSchemaResponse,
  });

  revisionId: string | null = null;
  isModeration = false;

  protected userPermissions = computed(() => {
    return this.registry()?.currentUserPermissions || [];
  });

  get isAdmin(): boolean {
    return this.userPermissions().includes(UserPermissions.Admin);
  }

  get isInitialState(): boolean {
    return this.registry()?.reviewsState === RegistrationReviewStates.Initial;
  }

  constructor() {
    this.route.parent?.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.actions
          .getRegistryById(id)
          .pipe(
            filter(() => {
              return !this.registry()?.withdrawn;
            }),
            tap(() => {
              this.actions.getSubjects(id);
              this.actions.getInstitutions(id);
            })
          )
          .subscribe();
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
    // [NM] TODO: add logic to handle fileId
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

  protected handleOpenMakeDecisionDialog() {
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
