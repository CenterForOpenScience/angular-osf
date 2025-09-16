import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { ClearCurrentProvider } from '@core/store/provider';
import { SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { IS_MEDIUM, Primitive } from '@osf/shared/helpers';
import { GetCollectionProvider } from '@osf/shared/stores';

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
export class CollectionModerationComponent implements OnInit, OnDestroy {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly tabOptions = COLLECTION_MODERATION_TABS;
  readonly isMedium = toSignal(inject(IS_MEDIUM));

  selectedTab = CollectionModerationTab.AllItems;

  actions = createDispatchMap({
    getCollectionProvider: GetCollectionProvider,
    clearCurrentProvider: ClearCurrentProvider,
  });

  ngOnInit(): void {
    this.selectedTab = this.route.snapshot.firstChild?.data['tab'];
    const id = this.route.snapshot.params['providerId'];

    if (!id) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.actions.getCollectionProvider(id);
  }

  ngOnDestroy(): void {
    this.actions.clearCurrentProvider();
  }

  onTabChange(value: Primitive): void {
    this.selectedTab = value as CollectionModerationTab;
    this.router.navigate([this.selectedTab], { relativeTo: this.route });
  }
}
