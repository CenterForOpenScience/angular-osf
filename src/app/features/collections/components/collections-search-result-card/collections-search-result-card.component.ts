import { TranslatePipe } from '@ngx-translate/core';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { CollectionSearchResultCard } from '@osf/features/collections/models';
import { SUBMISSION_ATTRIBUTES } from '@osf/features/collections/utils';

@Component({
  selector: 'osf-collections-search-result-card',
  imports: [DatePipe, TranslatePipe],
  templateUrl: './collections-search-result-card.component.html',
  styleUrl: './collections-search-result-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsSearchResultCardComponent {
  cardItem = input.required<CollectionSearchResultCard>();

  protected presentSubmissionAttributes = computed(() => {
    const item = this.cardItem();
    if (!item) return [];

    return SUBMISSION_ATTRIBUTES.map((attribute) => ({
      ...attribute,
      value: item[attribute.key as keyof CollectionSearchResultCard] as string,
    })).filter((attribute) => attribute.value);
  });
}
