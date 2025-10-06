import { TranslatePipe } from '@ngx-translate/core';

import { Checkbox } from 'primeng/checkbox';

import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentCheckboxItemModel } from '@osf/shared/models';

import { InfoIconComponent } from '../info-icon/info-icon.component';

@Component({
  selector: 'osf-component-checkbox-item',
  imports: [Checkbox, FormsModule, InfoIconComponent, TranslatePipe],
  templateUrl: './component-checkbox-item.component.html',
  styleUrl: './component-checkbox-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentCheckboxItemComponent {
  item = model.required<ComponentCheckboxItemModel>();
  tooltipText = input('');
}
