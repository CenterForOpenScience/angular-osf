import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DraftRegistrationAttributesJsonApi } from '@osf/shared/models';

import { CustomStepComponent } from '../../components/custom-step/custom-step.component';
import { RegistriesSelectors, UpdateDraft } from '../../store';

@Component({
  selector: 'osf-draft-registration-custom-step',
  imports: [CustomStepComponent],
  templateUrl: './draft-registration-custom-step.component.html',
  styleUrl: './draft-registration-custom-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraftRegistrationCustomStepComponent {
  protected readonly stepsData = select(RegistriesSelectors.getStepsData);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);
  protected actions = createDispatchMap({
    updateDraft: UpdateDraft,
  });

  filesLink = computed(() => {
    return this.draftRegistration()?.branchedFrom?.filesLink || '';
  });

  provider = computed(() => {
    return this.draftRegistration()?.providerId || '';
  });

  projectId = computed(() => {
    return this.draftRegistration()?.branchedFrom?.id || '';
  });

  onUpdateAction(attributes: Partial<DraftRegistrationAttributesJsonApi>): void {
    const payload = {
      registration_responses: { ...attributes },
    };
    this.actions.updateDraft(this.route.snapshot.params['id'], payload);
  }

  onBack(): void {
    this.router.navigate(['../', 'metadata'], { relativeTo: this.route });
  }

  onNext(): void {
    this.router.navigate(['../', 'review'], { relativeTo: this.route });
  }
}
