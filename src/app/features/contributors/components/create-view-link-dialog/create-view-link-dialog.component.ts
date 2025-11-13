import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentCheckboxItemComponent } from '@osf/shared/components/component-checkbox-item/component-checkbox-item.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';
import { CurrentResourceSelectors, GetResourceWithChildren } from '@osf/shared/stores/current-resource';
import { ComponentCheckboxItemModel } from '@shared/models/component-checkbox-item.model';

import { ResourceInfoModel, ViewOnlyLinkComponentItem } from '../../models';

@Component({
  selector: 'osf-create-view-link-dialog',
  imports: [
    Button,
    TranslatePipe,
    ReactiveFormsModule,
    FormsModule,
    Checkbox,
    TextInputComponent,
    LoadingSpinnerComponent,
    ComponentCheckboxItemComponent,
  ],
  templateUrl: './create-view-link-dialog.component.html',
  styleUrl: './create-view-link-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateViewLinkDialogComponent implements OnInit {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  readonly inputLimits = InputLimits;

  linkName = new FormControl('', { nonNullable: true, validators: [CustomValidators.requiredTrimmed()] });
  anonymous = signal(true);

  readonly components = select(CurrentResourceSelectors.getResourceWithChildren);
  readonly isLoading = select(CurrentResourceSelectors.isResourceWithChildrenLoading);
  readonly actions = createDispatchMap({ getComponents: GetResourceWithChildren });

  componentsList: WritableSignal<ComponentCheckboxItemModel[]> = signal([]);

  constructor() {
    effect(() => {
      const currentResource = this.config.data as ResourceInfoModel;
      const components = this.components();

      const items: ComponentCheckboxItemModel[] = components.map((item) => ({
        id: item.id,
        title: item.title,
        isCurrent: currentResource.id === item.id,
        parentId: item.parentId,
        checked: currentResource.id === item.id,
        disabled: currentResource.id === item.id,
      }));

      const updatedItems = items.map((item) => ({
        ...item,
        disabled: item.isCurrent ? item.disabled : !this.isParentChecked(item, items),
      }));

      this.componentsList.set(updatedItems);
    });
  }

  ngOnInit(): void {
    const currentResource = this.config.data as ResourceInfoModel;
    const { id, type, rootParentId } = currentResource;

    if (id) {
      this.actions.getComponents(rootParentId ?? '', id, type);
    }
  }

  onCheckboxChange(changedItem: ViewOnlyLinkComponentItem): void {
    this.componentsList.update((items) => {
      let updatedItems = [...items];

      if (!changedItem.checked) {
        updatedItems = this.uncheckChildren(changedItem.id, updatedItems);
      }

      return updatedItems.map((item) => ({
        ...item,
        disabled: item.isCurrent ? item.disabled : !this.isParentChecked(item, updatedItems),
      }));
    });
  }

  addLink(): void {
    if (this.linkName.invalid) return;

    const currentResource = this.config.data as ResourceInfoModel;
    const selectedIds = this.componentsList()
      .filter((x) => x.checked)
      .map((x) => x.id);

    const data = this.buildLinkData(selectedIds, currentResource.id, this.linkName.value, this.anonymous());

    this.dialogRef.close(data);
  }

  private isParentChecked(item: ViewOnlyLinkComponentItem, items: ViewOnlyLinkComponentItem[]): boolean {
    if (!item.parentId) {
      return true;
    }

    const parent = items.find((x) => x.id === item.parentId);

    return parent?.checked ?? true;
  }

  private uncheckChildren(parentId: string, items: ViewOnlyLinkComponentItem[]): ViewOnlyLinkComponentItem[] {
    let updatedItems = items.map((item) => {
      if (item.parentId === parentId) {
        return { ...item, checked: false };
      }
      return item;
    });

    const directChildren = updatedItems.filter((item) => item.parentId === parentId);

    for (const child of directChildren) {
      updatedItems = this.uncheckChildren(child.id, updatedItems);
    }

    return updatedItems;
  }

  private buildLinkData(
    selectedIds: string[],
    rootProjectId: string,
    linkName: string,
    isAnonymous: boolean
  ): Record<string, unknown> {
    const rootProject = selectedIds.includes(rootProjectId) ? [{ id: rootProjectId, type: 'nodes' }] : [];
    const relationshipComponents = selectedIds
      .filter((id) => id !== rootProjectId)
      .map((id) => ({ id, type: 'nodes' }));

    const data: Record<string, unknown> = {
      attributes: {
        name: linkName,
        anonymous: isAnonymous,
      },
      nodes: rootProject,
    };

    if (relationshipComponents.length) {
      data['relationships'] = {
        nodes: { data: relationshipComponents },
      };
    }

    return data;
  }
}
