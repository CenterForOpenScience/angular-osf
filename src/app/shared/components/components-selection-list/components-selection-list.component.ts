import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

import { ComponentCheckboxItemModel } from '@osf/shared/models';

import { ComponentCheckboxItemComponent } from '../component-checkbox-item/component-checkbox-item.component';

@Component({
  selector: 'osf-components-selection-list',
  imports: [Button, ComponentCheckboxItemComponent, TranslatePipe],
  templateUrl: './components-selection-list.component.html',
  styleUrl: './components-selection-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsSelectionListComponent {
  components = model.required<ComponentCheckboxItemModel[]>();
  disabledTooltip = input<string>('');

  isSelectAllDisabled = computed(() =>
    this.components()
      .filter((item) => !item.disabled)
      .every((item) => item.checked)
  );

  isRemoveAllDisabled = computed(() =>
    this.components()
      .filter((item) => !item.disabled)
      .every((item) => !item.checked)
  );

  onItemChange(changedItem: ComponentCheckboxItemModel, index: number) {
    const updatedComponents = [...this.components()];
    updatedComponents[index] = { ...changedItem };

    this.components.set(updatedComponents);
  }

  removeAll() {
    const filteredItems = this.components().map((item) => ({ ...item, checked: item.disabled ? item.checked : false }));

    this.components.set(filteredItems);
  }

  selectAll() {
    const filteredItems = this.components().map((item) => ({ ...item, checked: item.disabled ? item.checked : true }));

    this.components.set(filteredItems);
  }
}
