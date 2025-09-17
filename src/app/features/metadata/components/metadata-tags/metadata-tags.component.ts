import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { TagsInputComponent } from '@osf/shared/components/tags-input/tags-input.component';

@Component({
  selector: 'osf-metadata-tags',
  imports: [Card, TranslatePipe, TagsInputComponent],
  templateUrl: './metadata-tags.component.html',
  styleUrl: './metadata-tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataTagsComponent {
  tags = input<string[]>([]);
  tagsChanged = output<string[]>();
}
