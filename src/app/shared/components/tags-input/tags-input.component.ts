import { TranslatePipe } from '@ngx-translate/core';

import { Chip } from 'primeng/chip';
import { InputText } from 'primeng/inputtext';

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'osf-tags-input',
  imports: [TranslatePipe, FormsModule, Chip, InputText],
  templateUrl: './tags-input.component.html',
  styleUrl: './tags-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsInputComponent {
  tags = input<string[]>([]);
  required = input<boolean>(false);
  readonly = input<boolean>(false);
  tagsChanged = output<string[]>();

  inputValue = signal<string>('');
  inputElement = viewChild<ElementRef<HTMLInputElement>>('tagInput');

  localTags = signal<string[]>([]);
  private isLocalUpdate = false;

  constructor() {
    effect(() => {
      const incoming = this.tags();

      if (!this.isLocalUpdate) {
        this.localTags.set([...incoming]);
      }

      this.isLocalUpdate = false;
    });
  }

  onContainerClick(): void {
    this.inputElement()?.nativeElement.focus();
  }

  onContainerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.inputElement()?.nativeElement.focus();
    }
  }

  onInputKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();

    if ((event.key === 'Enter' || event.key === ',' || event.key === ' ') && value) {
      event.preventDefault();
      this.addTag(value);
      target.value = '';
      this.inputValue.set('');
    } else if (event.key === 'Backspace' && !value && this.localTags().length > 0) {
      this.removeTag(this.localTags().length - 1);
    }
  }

  onInputBlur(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();

    if (value) {
      this.addTag(value);
      target.value = '';
      this.inputValue.set('');
    }
  }

  private addTag(tagValue: string): void {
    if (this.readonly()) return;

    const currentTags = this.localTags();
    const normalizedValue = tagValue.replace(/[,\s]+/g, ' ').trim();

    if (normalizedValue && !currentTags.includes(normalizedValue)) {
      const updatedTags = [...currentTags, normalizedValue];

      this.localTags.set(updatedTags);
      this.isLocalUpdate = true;

      this.tagsChanged.emit(updatedTags);
    }
  }

  removeTag(index: number): void {
    if (this.readonly()) return;

    const currentTags = this.localTags();
    const updatedTags = currentTags.filter((_, i) => i !== index);

    this.localTags.set(updatedTags);
    this.isLocalUpdate = true;

    this.tagsChanged.emit(updatedTags);
  }
}
