import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Skeleton } from 'primeng/skeleton';

import { finalize } from 'rxjs';

import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ResourceCardService } from '@osf/features/search/components/resources/components/resource-card/services/resource-card.service';
import { Resource } from '@shared/entities/resource-card/resource.entity';
import { ResourceType } from '@shared/entities/resource-card/resource-type.enum';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-resource-card',
  imports: [Accordion, AccordionContent, AccordionHeader, AccordionPanel, DatePipe, NgOptimizedImage, Skeleton],
  templateUrl: './resource-card.component.html',
  styleUrl: './resource-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCardComponent {
  item = model<Resource | undefined>(undefined);
  readonly #resourceCardService = inject(ResourceCardService);
  loading = false;
  dataIsLoaded = false;
  isSmall = toSignal(inject(IS_XSMALL));

  protected readonly ResourceType = ResourceType;

  onOpen() {
    if (this.item() && !this.dataIsLoaded) {
      const userIri = this.item()?.id.split('/').pop();
      if (userIri) {
        this.loading = true;
        this.#resourceCardService
          .getUserRelatedCounts(userIri)
          .pipe(
            finalize(() => {
              this.loading = false;
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
}
