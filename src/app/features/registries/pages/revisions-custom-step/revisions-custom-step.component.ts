import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomStepComponent } from '../../components/custom-step/custom-step.component';
import { RegistriesSelectors, UpdateSchemaResponse } from '../../store';

@Component({
  selector: 'osf-revisions-custom-step',
  imports: [CustomStepComponent],
  templateUrl: './revisions-custom-step.component.html',
  styleUrl: './revisions-custom-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevisionsCustomStepComponent {
  readonly schemaResponse = select(RegistriesSelectors.getSchemaResponse);
  readonly schemaResponseRevisionData = select(RegistriesSelectors.getSchemaResponseRevisionData);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  actions = createDispatchMap({
    updateRevision: UpdateSchemaResponse,
  });

  filesLink = computed(() => {
    return this.schemaResponse()?.filesLink || ' ';
  });

  provider = computed(() => {
    return this.schemaResponse()?.registrationId || '';
  });

  projectId = computed(() => {
    return this.schemaResponse()?.registrationId || '';
  });

  stepsData = computed(() => {
    const schemaResponse = this.schemaResponse();
    return schemaResponse?.revisionResponses || {};
  });

  onUpdateAction(data: Record<string, unknown>): void {
    const id: string = this.route.snapshot.params['id'] || '';
    this.actions.updateRevision(id, this.schemaResponse()?.revisionJustification ?? '', data);
  }

  onBack(): void {
    this.router.navigate(['../', 'justification'], { relativeTo: this.route });
  }

  onNext(): void {
    this.router.navigate(['../', 'review'], { relativeTo: this.route });
  }
}
