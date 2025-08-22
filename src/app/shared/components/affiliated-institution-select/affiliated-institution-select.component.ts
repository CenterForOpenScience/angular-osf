import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Skeleton } from 'primeng/skeleton';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, OnInit, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Institution } from '@shared/models';
import { FetchUserInstitutions, InstitutionsSelectors } from '@shared/stores/institutions';

@Component({
  selector: 'osf-affiliated-institution-select',
  imports: [Button, Checkbox, NgOptimizedImage, TranslatePipe, FormsModule, Skeleton],
  templateUrl: './affiliated-institution-select.component.html',
  styleUrl: './affiliated-institution-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffiliatedInstitutionSelectComponent implements OnInit {
  calculateSelectedItemsMode = input<boolean>(false);
  selectAllByDefault = input<boolean>(false);
  selectInstitutions = output<Institution[]>();

  private actions = createDispatchMap({
    fetchUserInstitutions: FetchUserInstitutions,
  });

  userInstitutions = select(InstitutionsSelectors.getUserInstitutions);
  areUserInstitutionsLoading = select(InstitutionsSelectors.areUserInstitutionsLoading);
  resourceInstitutions = select(InstitutionsSelectors.getResourceInstitutions);
  areResourceInstitutionsLoading = select(InstitutionsSelectors.areResourceInstitutionsLoading);
  areResourceInstitutionsSubmitting = select(InstitutionsSelectors.areResourceInstitutionsSubmitting);

  selectedInstitutions = signal<Institution[]>([]);

  constructor() {
    effect(() => {
      const resourceInstitutions = this.resourceInstitutions();
      if (this.calculateSelectedItemsMode()) {
        untracked(() => {
          this.selectedInstitutions.set([...resourceInstitutions]);
        });
      }
    });

    effect(() => {
      const userInstitutions = this.userInstitutions();
      if (this.selectAllByDefault()) {
        untracked(() => {
          this.selectAll();
        });
      }
    });
  }

  ngOnInit(): void {
    this.actions.fetchUserInstitutions();
  }

  removeAll() {
    this.selectedInstitutions.set([]);
    this.selectInstitutions.emit(this.selectedInstitutions());
  }

  selectAll() {
    this.selectedInstitutions.set([...this.userInstitutions()]);
    this.selectInstitutions.emit(this.selectedInstitutions());
  }

  selectDeselectInstitution(institution: Institution) {
    const idx = this.selectedInstitutions().findIndex((item) => item.id === institution.id);
    if (idx > -1) {
      this.selectedInstitutions.set(this.selectedInstitutions().filter((item) => item.id !== institution.id));
    } else {
      this.selectedInstitutions.set([...this.selectedInstitutions(), institution]);
    }
    this.selectInstitutions.emit(this.selectedInstitutions());
  }
}
