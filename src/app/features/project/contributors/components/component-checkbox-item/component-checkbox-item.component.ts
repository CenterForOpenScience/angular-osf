import { TranslatePipe } from '@ngx-translate/core';

import { Checkbox } from 'primeng/checkbox';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InfoIconComponent } from '@osf/shared/components';

import { ViewOnlyLinkComponentItem } from '../../models';

@Component({
  selector: 'osf-component-checkbox-item',
  imports: [Checkbox, FormsModule, InfoIconComponent, TranslatePipe],
  templateUrl: './component-checkbox-item.component.html',
  styleUrl: './component-checkbox-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentCheckboxItemComponent {
  item = input.required<ViewOnlyLinkComponentItem>();
  checkboxChange = output<void>();

  onCheckboxChange(): void {
    this.checkboxChange.emit();
  }
}
