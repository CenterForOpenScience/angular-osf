import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { ClearCurrentProvider } from '@core/store/provider';
import { SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { IS_MEDIUM, Primitive } from '@osf/shared/helpers';
import { GetRegistryProvider } from '@osf/shared/stores/registration-provider';

import { REGISTRY_MODERATION_TABS } from '../../constants';
import { RegistryModerationTab } from '../../enums';

@Component({
  selector: 'osf-registries-moderation',
  imports: [
    SubHeaderComponent,
    TabList,
    Tabs,
    Tab,
    TabPanels,
    TranslatePipe,
    FormsModule,
    SelectComponent,
    RouterOutlet,
  ],
  templateUrl: './registries-moderation.component.html',
  styleUrl: './registries-moderation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesModerationComponent implements OnInit, OnDestroy {
  readonly resourceType = ResourceType.Registration;
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly tabOptions = REGISTRY_MODERATION_TABS;
  readonly isMedium = toSignal(inject(IS_MEDIUM));

  actions = createDispatchMap({
    getProvider: GetRegistryProvider,
    clearCurrentProvider: ClearCurrentProvider,
  });

  selectedTab = RegistryModerationTab.Submitted;

  ngOnInit(): void {
    this.selectedTab = this.route.snapshot.firstChild?.data['tab'];
    const id = this.route.snapshot.params['providerId'];

    if (!id) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.actions.getProvider(id);
  }

  ngOnDestroy(): void {
    this.actions.clearCurrentProvider();
  }

  onTabChange(value: Primitive): void {
    this.selectedTab = value as RegistryModerationTab;
    this.router.navigate([this.selectedTab], { relativeTo: this.route });
  }
}
