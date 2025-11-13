import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'osf-tags-list',
  imports: [Tag, Skeleton, TranslatePipe],
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsListComponent {
  tags = input<string[]>([]);
  isLoading = input<boolean>(false);
  tagClick = output<string>();

  onTagClick(tag: string): void {
    this.tagClick.emit(tag);
  }
}
