import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

import { TagsInputComponent } from '@osf/shared/components/tags-input/tags-input.component';

@Component({
  selector: 'osf-metadata-tags',
  imports: [Card, TranslatePipe, TagsInputComponent, Tag],
  templateUrl: './metadata-tags.component.html',
  styleUrl: './metadata-tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataTagsComponent {
  tags = input<string[]>([]);
  readonly = input<boolean>(false);

  tagsChanged = output<string[]>();

  private router = inject(Router);

  tagClicked(tag: string) {
    this.router.navigate(['/search'], { queryParams: { search: tag } });
  }
}
