import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoadingSpinnerComponent, TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { CustomValidators } from '@osf/shared/helpers';
import { CurrentResourceSelectors, GetResourceChildren } from '@osf/shared/stores';
import { ViewOnlyLinkChildren } from '@shared/models';

import { ResourceInfoModel } from '../../models';

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
  selectedComponents = signal<Record<string, boolean>>({});
  components = select(CurrentResourceSelectors.getResourceChildren);
  isLoading = select(CurrentResourceSelectors.isResourceChildrenLoading);

  actions = createDispatchMap({ getComponents: GetResourceChildren });

  get currentResource() {
    return this.config.data as ResourceInfoModel;
  }

  get allComponents(): ViewOnlyLinkChildren[] {
    const currentResourceData = this.currentResource;
    const components = this.components();

    const result: ViewOnlyLinkChildren[] = [];

    if (currentResourceData) {
      result.push({
        id: currentResourceData.id,
        title: currentResourceData.title,
        isCurrentResource: true,
      });
    }

    components.forEach((comp) => {
      result.push({
        id: comp.id,
        title: comp.title,
        isCurrentResource: false,
      });
    });

    return result;
  }

  constructor() {
    effect(() => {
      const components = this.allComponents;
      if (components.length) {
        this.initializeSelection();
      }
    });
  }

  ngOnInit(): void {
    const projectId = this.currentResource.id;

    if (projectId) {
      this.actions.getComponents(projectId, this.currentResource.type);
    } else {
      this.initializeSelection();
    }
  }

  private initializeSelection(): void {
    const initialState: Record<string, boolean> = {};

    this.allComponents.forEach((component) => {
      initialState[component.id] = component.isCurrentResource;
    });

    this.selectedComponents.set(initialState);
  }

  addLink(): void {
    if (this.linkName.invalid) return;

    const selectedIds = Object.entries(this.selectedComponents())
      .filter(([, checked]) => checked)
      .map(([id]) => id);

    const rootProjectId = this.currentResource.id;
    const rootProject = selectedIds.includes(rootProjectId) ? [{ id: rootProjectId, type: 'nodes' }] : [];

    const relationshipComponents = selectedIds
      .filter((id) => id !== rootProjectId)
      .map((id) => ({ id, type: 'nodes' }));

    const data: Record<string, unknown> = {
      attributes: {
        name: this.linkName.value,
        anonymous: this.anonymous(),
      },
      nodes: rootProject,
    };

    if (relationshipComponents.length) {
      data['relationships'] = {
        nodes: {
          data: relationshipComponents,
        },
      };
    }

    this.dialogRef.close(data);
  }

  onCheckboxToggle(id: string, checked: boolean): void {
    this.selectedComponents.update((prev) => ({ ...prev, [id]: checked }));
  }

  selectAllComponents(): void {
    const allIds: Record<string, boolean> = {};
    this.allComponents.forEach((component) => {
      allIds[component.id] = true;
    });
    this.selectedComponents.set(allIds);
  }

  deselectAllComponents(): void {
    const allIds: Record<string, boolean> = {};
    this.allComponents.forEach((component) => {
      allIds[component.id] = component.isCurrentResource;
    });
    this.selectedComponents.set(allIds);
  }
}
