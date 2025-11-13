import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { hasViewOnlyParam } from '@osf/shared/helpers/view-only.helper';

import { RegistrationLinksCardComponent } from '../../components';
import { GetRegistryComponents, RegistryComponentsSelectors } from '../../store/registry-components';

@Component({
  selector: 'osf-registry-components',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    LoadingSpinnerComponent,
    RegistrationLinksCardComponent,
    ViewOnlyLinkMessageComponent,
  ],
  templateUrl: './registry-components.component.html',
  styleUrl: './registry-components.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryComponentsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private registryId = signal('');

  actions = createDispatchMap({ getRegistryComponents: GetRegistryComponents });

  hasViewOnly = computed(() => hasViewOnlyParam(this.router));

  registryComponents = select(RegistryComponentsSelectors.getRegistryComponents);
  registryComponentsLoading = select(RegistryComponentsSelectors.getRegistryComponentsLoading);

  ngOnInit(): void {
    this.registryId.set(this.route.parent?.parent?.snapshot.params['id']);

    if (this.registryId()) {
      this.actions.getRegistryComponents(this.registryId());
    }
  }

  reviewComponentDetails(id: string): void {
    this.router.navigate([id, 'overview']);
  }
}
