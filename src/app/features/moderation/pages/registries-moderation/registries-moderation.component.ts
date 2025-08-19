import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { IS_MEDIUM, Primitive } from '@osf/shared/helpers';

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
export class RegistriesModerationComponent implements OnInit {
  readonly resourceType = ResourceType.Registration;
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly tabOptions = REGISTRY_MODERATION_TABS;
  readonly isMedium = toSignal(inject(IS_MEDIUM));

  selectedTab = RegistryModerationTab.Submitted;

  ngOnInit(): void {
    this.selectedTab = this.route.snapshot.firstChild?.data['tab'] as RegistryModerationTab;
  }

  onTabChange(value: Primitive): void {
    this.selectedTab = value as RegistryModerationTab;
    this.router.navigate([this.selectedTab], { relativeTo: this.route });
  }
}
