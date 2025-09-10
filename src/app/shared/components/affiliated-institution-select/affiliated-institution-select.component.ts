import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Skeleton } from 'primeng/skeleton';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Institution } from '@shared/models';

@Component({
  selector: 'osf-affiliated-institution-select',
  imports: [Button, Checkbox, NgOptimizedImage, TranslatePipe, FormsModule, Skeleton],
  templateUrl: './affiliated-institution-select.component.html',
  styleUrl: './affiliated-institution-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffiliatedInstitutionSelectComponent {
  institutions = input<Institution[]>([]);
  isLoading = input<boolean>(false);
  selectedInstitutions = model<Institution[]>([]);

  isSelectAllDisabled = computed(() => {
    const institutions = this.institutions();
    const selected = this.selectedInstitutions();
    return institutions.length === 0 || institutions.length === selected.length;
  });

  isRemoveAllDisabled = computed(() => this.selectedInstitutions().length === 0);

  removeAll() {
    this.selectedInstitutions.set([]);
  }

  selectAll() {
    this.selectedInstitutions.set([...this.institutions()]);
  }

  selectDeselectInstitution(institution: Institution) {
    this.selectedInstitutions.update((currentSelected) => {
      const isSelected = currentSelected.some((inst) => inst.id === institution.id);

      if (isSelected) {
        return currentSelected.filter((inst) => inst.id !== institution.id);
      } else {
        return [...currentSelected, institution];
      }
    });
  }
}
