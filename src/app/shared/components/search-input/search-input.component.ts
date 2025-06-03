import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'osf-search-input',
  imports: [InputText, ReactiveFormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  control = input<FormControl>(new FormControl<string>(''));
  placeholder = input<string>('');
  triggerSearch = output<string>();

  onEnterClicked() {
    const searchValue = this.control().value;

    if (!searchValue || !searchValue?.trim()?.length) {
      return;
    }

    this.triggerSearch.emit(searchValue);
  }
}
