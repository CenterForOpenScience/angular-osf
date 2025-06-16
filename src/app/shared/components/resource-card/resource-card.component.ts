import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Skeleton } from 'primeng/skeleton';

import { finalize } from 'rxjs';

import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ResourceType } from '@shared/enums';
import { Resource } from '@shared/models';
import { ResourceCardService } from '@shared/services';
import { IS_XSMALL } from '@shared/utils';

@Component({
  selector: 'osf-resource-card',
  imports: [Accordion, AccordionContent, AccordionHeader, AccordionPanel, DatePipe, NgOptimizedImage, Skeleton],
  templateUrl: './resource-card.component.html',
  styleUrl: './resource-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCardComponent {
  private readonly resourceCardService = inject(ResourceCardService);
  ResourceType = ResourceType;
  isSmall = toSignal(inject(IS_XSMALL));
  item = model.required<Resource>();

  isLoading = false;
  dataIsLoaded = false;

  onOpen() {
    if (!this.item() || this.dataIsLoaded || this.item().resourceType !== ResourceType.Agent) {
      return;
    }

    const userIri = this.item()?.id.split('/').pop();
    if (userIri) {
      this.isLoading = true;
      this.resourceCardService
        .getUserRelatedCounts(userIri)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.dataIsLoaded = true;
          })
        )
        .subscribe((res) => {
          this.item.update(
            (current) =>
              ({
                ...current,
                publicProjects: res.projects,
                publicPreprints: res.preprints,
                publicRegistrations: res.registrations,
                education: res.education,
                employment: res.employment,
              }) as Resource
          );
        });
    }
  }
}
