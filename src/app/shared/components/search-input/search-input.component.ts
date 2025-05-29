import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'osf-search-input',
  imports: [InputText, FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  placeholder = input<string>('');
  searchValue = model<string>();
  triggerSearch = output<string>();

  onSearchChange(value: string): void {
    this.searchValue.set(value);
  }

  onEnterClicked() {
    const searchValue = this.searchValue();
    if (!searchValue) {
      return;
    }

    if (searchValue.trim().length > 0) {
      this.triggerSearch.emit(searchValue);
    }
  }
}
