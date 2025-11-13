import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';
import { Primitive } from '@osf/shared/helpers/types.helper';

import { PREPRINT_MODERATION_TABS } from '../../constants';
import { PreprintModerationTab } from '../../enums';
import { GetPreprintProvider } from '../../store/preprint-moderation';

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

  private readonly actions = createDispatchMap({ getPreprintProvider: GetPreprintProvider });

  ngOnInit(): void {
    this.selectedTab = this.route.snapshot.firstChild?.data['tab'] as PreprintModerationTab;

    const id = this.route.snapshot.params['providerId'];

    if (!id) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.actions.getPreprintProvider(id);
  }

  onTabChange(value: Primitive): void {
    this.selectedTab = value as PreprintModerationTab;
    this.router.navigate([this.selectedTab], { relativeTo: this.route });
  }
}
