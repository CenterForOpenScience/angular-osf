import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GetComponents, ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { LoadingSpinnerComponent, TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { CustomValidators } from '@osf/shared/helpers';
import { ViewOnlyLinkComponent } from '@shared/models';

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
  linkName = new FormControl('', { nonNullable: true, validators: [CustomValidators.requiredTrimmed()] });

  readonly dialogRef = inject(DynamicDialogRef);
  protected readonly config = inject(DynamicDialogConfig);
  inputLimits = InputLimits;

  anonymous = signal(true);
  protected selectedComponents = signal<Record<string, boolean>>({});
  protected components = select(ProjectOverviewSelectors.getComponents);
  protected isLoading = select(ProjectOverviewSelectors.getComponentsLoading);

  protected actions = createDispatchMap({
    getComponents: GetComponents,
  });

  get currentProjectId(): string {
    return this.config.data?.['projectId'] || '';
  }

  get allComponents(): ViewOnlyLinkComponent[] {
    const currentProjectData = this.config.data?.['currentProject'];
    const components = this.components();

    const result: ViewOnlyLinkComponent[] = [];

    if (currentProjectData) {
      result.push({
        id: currentProjectData.id,
        title: currentProjectData.title,
        isCurrentProject: true,
      });
    }

    components.forEach((comp) => {
      result.push({
        id: comp.id,
        title: comp.title,
        isCurrentProject: false,
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
    const projectId = this.currentProjectId;

    if (projectId) {
      this.actions.getComponents(projectId);
    } else {
      this.initializeSelection();
    }
  }

  private initializeSelection(): void {
    const initialState: Record<string, boolean> = {};

    this.allComponents.forEach((component) => {
      initialState[component.id] = component.isCurrentProject;
    });

    this.selectedComponents.set(initialState);
  }

  isCurrentProject(item: ViewOnlyLinkComponent): boolean {
    return item.isCurrentProject;
  }

  get isFormValid(): boolean {
    return this.linkName.valid && !!this.linkName.value.trim().length;
  }

  addLink(): void {
    if (!this.isFormValid) return;

    const selectedIds = Object.entries(this.selectedComponents())
      .filter(([, checked]) => checked)
      .map(([id]) => id);

    const rootProjectId = this.currentProjectId;
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
      allIds[component.id] = component.isCurrentProject;
    });
    this.selectedComponents.set(allIds);
  }
}
