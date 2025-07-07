import { createDispatchMap, select } from '@ngxs/store';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Select, SelectChangeEvent } from 'primeng/select';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';

import { StringOrNull } from '@core/helpers';
import { SupplementOptions } from '@osf/features/preprints/enums';
import { GetAvailableProjects, SubmitPreprintSelectors } from '@osf/features/preprints/store/submit-preprint';
import { AddProjectFormComponent } from '@shared/components';

@Component({
  selector: 'osf-supplements-step',
  imports: [Button, TitleCasePipe, NgClass, Card, Select, AddProjectFormComponent],
  templateUrl: './supplements-step.component.html',
  styleUrl: './supplements-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplementsStepComponent implements OnInit {
  private actions = createDispatchMap({
    getAvailableProjects: GetAvailableProjects,
  });
  private destroyRef = inject(DestroyRef);

  readonly SupplementOptions = SupplementOptions;

  selectedSupplementOption = signal<SupplementOptions>(SupplementOptions.None);
  availableProjects = select(SubmitPreprintSelectors.getAvailableProjects);
  areAvailableProjectsLoading = select(SubmitPreprintSelectors.areAvailableProjectsLoading);

  selectedProjectId = signal<StringOrNull>(null);

  projectNameControl = new FormControl<StringOrNull>(null);

  nextClicked = output<void>();

  ngOnInit() {
    this.projectNameControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((projectNameOrId) => {
        if (this.selectedProjectId() === projectNameOrId) {
          return;
        }

        this.actions.getAvailableProjects(projectNameOrId);
      });
  }

  selectSupplementOption(supplementOption: SupplementOptions) {
    this.selectedSupplementOption.set(supplementOption);

    if (supplementOption === SupplementOptions.ConnectExistingProject) {
      this.actions.getAvailableProjects(null);
    }
  }

  selectProject(event: SelectChangeEvent) {
    if (!(event.originalEvent instanceof PointerEvent)) {
      return;
    }

    this.selectedProjectId.set(event.value);
  }

  disconnectProject() {
    this.selectedProjectId.set(null);
  }

  nextButtonClicked() {
    this.nextClicked.emit();
  }

  backButtonClicked() {
    //TODO
  }
}
