import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GetRegistryResources, RegistryResourcesSelectors } from '@osf/features/registry/store/registry-resources';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';

@Component({
  selector: 'osf-registry-resources',
  imports: [SubHeaderComponent, TranslatePipe, Button, LoadingSpinnerComponent],
  templateUrl: './registry-resources.component.html',
  styleUrl: './registry-resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryResourcesComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  private readonly route = inject(ActivatedRoute);

  protected readonly resources = select(RegistryResourcesSelectors.getResources);
  protected readonly isResourcesLoading = select(RegistryResourcesSelectors.isResourcesLoading);

  private readonly actions = createDispatchMap({
    getResources: GetRegistryResources,
  });

  constructor() {
    this.route.parent?.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.actions.getResources(id);
      }
    });
  }
}
