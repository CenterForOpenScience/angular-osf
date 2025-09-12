import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RegistriesSelectors, UpdateDraft } from '@osf/features/registries/store';
import { TagsInputComponent } from '@osf/shared/components';

@Component({
  selector: 'osf-registries-tags',
  imports: [Card, TagsInputComponent, TranslatePipe],
  templateUrl: './registries-tags.component.html',
  styleUrl: './registries-tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesTagsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly draftId = this.route.snapshot.params['id'];
  selectedTags = select(RegistriesSelectors.getSelectedTags);

  actions = createDispatchMap({
    updateDraft: UpdateDraft,
  });

  onTagsChanged(tags: string[]): void {
    this.actions.updateDraft(this.draftId, { tags });
  }
}
