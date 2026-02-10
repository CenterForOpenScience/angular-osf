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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly schemaResponse = select(RegistriesSelectors.getSchemaResponse);
  readonly schemaResponseRevisionData = select(RegistriesSelectors.getSchemaResponseRevisionData);

  actions = createDispatchMap({ updateRevision: UpdateSchemaResponse });

  filesLink = computed(() => this.schemaResponse()?.filesLink || ' ');
  provider = computed(() => this.schemaResponse()?.registrationId || '');
  projectId = computed(() => this.schemaResponse()?.registrationId || '');
  stepsData = computed(() => this.schemaResponse()?.revisionResponses || {});

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
