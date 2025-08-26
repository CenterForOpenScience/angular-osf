import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { IconComponent } from '@shared/components';

@Component({
  selector: 'osf-search-input',
  imports: [InputText, Button, ReactiveFormsModule, IconComponent],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  control = input<FormControl>(new FormControl<string>(''));
  placeholder = input<string>('');
  showHelpIcon = input(false);

  triggerSearch = output<string>();
  helpClicked = output<void>();

  enterClicked() {
    const searchValue = this.control().value;

    if (!searchValue || !searchValue?.trim()?.length) {
      return;
    }

    this.triggerSearch.emit(searchValue);
  }
}
