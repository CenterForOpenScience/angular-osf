import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { RegistrationLinksCardComponent } from '../../components/registration-links-card/registration-links-card.component';
import { GetRegistryComponents, RegistryComponentsSelectors } from '../../store/registry-components';

@Component({
  selector: 'osf-registry-components',
  imports: [
    SubHeaderComponent,
    LoadingSpinnerComponent,
    RegistrationLinksCardComponent,
    ViewOnlyLinkMessageComponent,
    TranslatePipe,
  ],
  templateUrl: './registry-components.component.html',
  styleUrl: './registry-components.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryComponentsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly viewOnlyService = inject(ViewOnlyLinkHelperService);

  private readonly registryId = toSignal<string | undefined>(
    this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined)
  );

  actions = createDispatchMap({ getRegistryComponents: GetRegistryComponents });

  hasViewOnly = computed(() => this.viewOnlyService.hasViewOnlyParam(this.router));

  registryComponents = select(RegistryComponentsSelectors.getRegistryComponents);
  registryComponentsLoading = select(RegistryComponentsSelectors.getRegistryComponentsLoading);

  constructor() {
    effect(() => {
      const registryId = this.registryId();

      if (registryId) {
        this.actions.getRegistryComponents(registryId);
      }
    });
  }

  reviewComponentDetails(id: string): void {
    this.router.navigate([id, 'overview']);
  }
}
