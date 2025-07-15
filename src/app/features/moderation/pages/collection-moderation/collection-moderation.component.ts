import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { Primitive } from '@osf/core/helpers';
import { SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { IS_MEDIUM } from '@osf/shared/utils';

import { COLLECTION_MODERATION_TABS } from '../../constants';
import { CollectionModerationTab } from '../../enums';

@Component({
  selector: 'osf-collection-moderation',
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
  templateUrl: './collection-moderation.component.html',
  styleUrl: './collection-moderation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionModerationComponent implements OnInit {
  readonly resourceType = ResourceType.Collection;
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly tabOptions = COLLECTION_MODERATION_TABS;
  readonly isMedium = toSignal(inject(IS_MEDIUM));

  selectedTab = CollectionModerationTab.AllItems;

  ngOnInit(): void {
    this.selectedTab = this.route.snapshot.firstChild?.data['tab'];
  }

  onTabChange(value: Primitive): void {
    this.selectedTab = value as CollectionModerationTab;
    this.router.navigate([this.selectedTab], { relativeTo: this.route });
  }
}
