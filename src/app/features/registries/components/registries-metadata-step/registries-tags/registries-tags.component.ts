import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RegistriesSelectors, UpdateDraft } from '@osf/features/registries/store';
import { TagsInputComponent } from '@osf/shared/components/tags-input/tags-input.component';

@Component({
  selector: 'osf-registries-tags',
  imports: [Card, TagsInputComponent, TranslatePipe],
  templateUrl: './registries-tags.component.html',
  styleUrl: './registries-tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesTagsComponent {
  draftId = input.required<string>();

  actions = createDispatchMap({ updateDraft: UpdateDraft });

  selectedTags = select(RegistriesSelectors.getSelectedTags);

  onTagsChanged(tags: string[]): void {
    this.actions.updateDraft(this.draftId(), { tags });
  }
}
