import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Skeleton } from 'primeng/skeleton';

import { finalize } from 'rxjs';

import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { IS_XSMALL } from '@osf/shared/helpers';
import { DataResourcesComponent } from '@shared/components/data-resources/data-resources.component';
import { ResourceType } from '@shared/enums';
import { Resource } from '@shared/models';
import { ResourceCardService } from '@shared/services';

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
    TranslatePipe,
    DataResourcesComponent,
  ],
  templateUrl: './resource-card.component.html',
  styleUrl: './resource-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCardComponent {
  private readonly resourceCardService = inject(ResourceCardService);
  ResourceType = ResourceType;
  isSmall = toSignal(inject(IS_XSMALL));
  item = model.required<Resource>();
  private readonly router = inject(Router);

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

  redirectToResource(item: Resource) {
    // [KP] TODO: handle my registrations and foreign separately
    if (item.resourceType === ResourceType.Registration) {
      const parts = item.id.split('/');
      const uri = parts[parts.length - 1];
      this.router.navigate(['/registries', uri]);
    }
  }
}
