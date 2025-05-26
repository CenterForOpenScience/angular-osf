import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Skeleton } from 'primeng/skeleton';

import { finalize } from 'rxjs';

import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ResourceType } from '@osf/shared/enums';
import { Resource } from '@osf/shared/models';
import { IS_XSMALL } from '@osf/shared/utils';

import { ResourceCardService } from '../../services';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-my-profile-resource-card',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    DatePipe,
    NgOptimizedImage,
    Skeleton,
    RouterLink,
  ],
  templateUrl: './my-profile-resource-card.component.html',
  styleUrl: './my-profile-resource-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileResourceCardComponent {
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

  protected readonly environment = environment;
}
