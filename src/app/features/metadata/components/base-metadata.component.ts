import { Component, input } from '@angular/core';

@Component({
  template: '',
})
export abstract class BaseMetadataComponent {
  disabled = input<boolean>(false);
  disabledButtonTooltip = input<string>('');
}
