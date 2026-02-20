import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, computed, HostBinding, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RegistrationOverviewModel } from '@osf/features/registry/models';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';

@Component({
  selector: 'osf-registry-revisions',
  imports: [Accordion, AccordionPanel, AccordionHeader, AccordionContent, Button, TranslatePipe, RouterLink],
  templateUrl: './registry-revisions.component.html',
  styleUrl: './registry-revisions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryRevisionsComponent {
  @HostBinding('class') classes = 'flex-1 flex';

  registry = input.required<RegistrationOverviewModel | null>();
  schemaResponses = input.required<SchemaResponse[]>();
  selectedRevisionIndex = input.required<number>();
  isSubmitting = input<boolean>(false);
  isModeration = input<boolean>(false);
  canEdit = input<boolean>(false);
  openRevision = output<number>();

  readonly updateRegistration = output<string>();
  readonly continueUpdate = output<void>();
  readonly RevisionReviewStates = RevisionReviewStates;

  readonly registryInProgress = computed(
    () => this.registry()?.revisionState === RevisionReviewStates.RevisionInProgress
  );

  readonly registryApproved = computed(() => this.registry()?.revisionState === RevisionReviewStates.Approved);

  readonly registryAcceptedUnapproved = computed(
    () =>
      this.registry()?.revisionState === RevisionReviewStates.Unapproved &&
      this.registry()?.reviewsState === RegistrationReviewStates.Accepted
  );

  readonly unApprovedRevisionId = computed(() => {
    if (!this.registryAcceptedUnapproved()) return null;
    return this.schemaResponses()?.find((r) => r.reviewsState === RevisionReviewStates.Unapproved)?.id ?? null;
  });

  revisions = computed(() => {
    let schemaResponses = this.schemaResponses() || [];

    schemaResponses = this.isModeration()
      ? schemaResponses
      : schemaResponses.filter((r) => r.reviewsState === RevisionReviewStates.Approved || r.isOriginalResponse);

    return schemaResponses.map((response, index) => {
      const onlyOne = schemaResponses.length === 1;
      const label = onlyOne
        ? `registry.overview.original`
        : index === 0
          ? `registry.overview.latest`
          : index === schemaResponses.length - 1
            ? `registry.overview.original`
            : `registry.overview.update`;
      return {
        ...response,
        index,
        label,
        isSelected: index === this.selectedRevisionIndex(),
      };
    });
  });

  emitOpenRevision(index: number) {
    this.openRevision.emit(index);
  }

  continueUpdateHandler(): void {
    this.continueUpdate.emit();
  }
}
