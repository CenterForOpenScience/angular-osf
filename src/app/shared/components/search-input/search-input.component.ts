import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'osf-search-input',
  standalone: true,
  imports: [InputText, FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  placeholder = input<string>('');
  searchValue = model<string>();

  onSearchChange(value: string): void {
    this.searchValue.set(value);
  }
}
