import { TranslatePipe } from '@ngx-translate/core';

import { Chips } from 'primeng/chips';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'osf-tags-input',
  imports: [TranslatePipe, FormsModule, Chips],
  templateUrl: './tags-input.component.html',
  styleUrl: './tags-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsInputComponent {
  tags = input<string[]>([]);
  required = input<boolean>(false);
  tagsChanged = output<string[]>();

  onTagsChange(tags: string[]): void {
    this.tagsChanged.emit(tags);
  }
}
