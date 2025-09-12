import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { IS_MEDIUM, Primitive } from '@osf/shared/helpers';

import { PREPRINT_MODERATION_TABS } from '../../constants';
import { PreprintModerationTab } from '../../enums';

@Component({
  selector: 'osf-preprint-moderation',
  imports: [
    SubHeaderComponent,
    TabList,
    Tabs,
    Tab,
    RouterOutlet,
    TabPanels,
    TranslatePipe,
    FormsModule,
    SelectComponent,
  ],
  templateUrl: './preprint-moderation.component.html',
  styleUrl: './preprint-moderation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintModerationComponent implements OnInit {
  readonly resourceType = ResourceType.Preprint;
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly tabOptions = PREPRINT_MODERATION_TABS;
  readonly isMedium = toSignal(inject(IS_MEDIUM));

  selectedTab = PreprintModerationTab.Submissions;

  ngOnInit(): void {
    this.selectedTab = this.route.snapshot.firstChild?.data['tab'] as PreprintModerationTab;
  }

  onTabChange(value: Primitive): void {
    this.selectedTab = value as PreprintModerationTab;
    this.router.navigate([this.selectedTab], { relativeTo: this.route });
  }
}
