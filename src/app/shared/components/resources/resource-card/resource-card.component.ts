import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
} from 'primeng/accordion';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ResourceType } from '@osf/features/search/models/resource-type.enum';
import { Resource } from '@osf/features/search/models/resource.entity';
import { ResourceCardService } from '@shared/components/resources/resource-card/resource-card.service';
import { finalize } from 'rxjs';
import { Skeleton } from 'primeng/skeleton';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@osf/shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-resource-card',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    DatePipe,
    NgOptimizedImage,
    Skeleton,
  ],
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
            }),
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
                }) as Resource,
            );
          });
      }
    }
  }
}
