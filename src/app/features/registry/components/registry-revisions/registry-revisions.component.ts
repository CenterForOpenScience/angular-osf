import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, computed, HostBinding, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RegistryOverview } from '@osf/features/registry/models';
import { RegistrationReviewStates } from '@osf/shared/enums';
import { RevisionReviewStates } from '@shared/enums';

@Component({
  selector: 'osf-registry-revisions',
  imports: [Accordion, AccordionPanel, AccordionHeader, AccordionContent, Button, TranslatePipe, RouterLink],
  templateUrl: './registry-revisions.component.html',
  styleUrl: './registry-revisions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryRevisionsComponent {
  @HostBinding('class') classes = 'flex-1 flex';

  registry = input.required<RegistryOverview | null>();
  selectedRevisionIndex = input.required<number>();
  isSubmitting = input<boolean>(false);
  isModeration = input<boolean>(false);
  canEdit = input<boolean>(false);
  openRevision = output<number>();

  readonly updateRegistration = output<string>();
  readonly continueUpdate = output<void>();
  readonly RevisionReviewStates = RevisionReviewStates;

  unApprovedRevisionId: string | null = null;

  revisions = computed(() => {
    let schemaResponses = this.registry()?.schemaResponses || [];
    if (this.registryAcceptedUnapproved) {
      this.unApprovedRevisionId =
        schemaResponses.find((response) => response.reviewsState === RevisionReviewStates.Unapproved)?.id || null;
    }
    schemaResponses = this.isModeration()
      ? schemaResponses
      : schemaResponses.filter((r) => r.reviewsState === RevisionReviewStates.Approved);

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

  get registryInProgress(): boolean {
    return this.registry()?.revisionStatus === RevisionReviewStates.RevisionInProgress;
  }

  get registryApproved(): boolean {
    return this.registry()?.revisionStatus === RevisionReviewStates.Approved;
  }

  get registryAcceptedUnapproved(): boolean {
    return (
      this.registry()?.revisionStatus === RevisionReviewStates.Unapproved &&
      this.registry()?.reviewsState === RegistrationReviewStates.Accepted
    );
  }

  emitOpenRevision(index: number) {
    this.openRevision.emit(index);
  }

  continueUpdateHandler(): void {
    this.continueUpdate.emit();
  }
}
