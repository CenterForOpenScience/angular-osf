import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProjectMetadataSelectors } from '@osf/features/project/metadata/store';
import { ProjectOverview } from '@osf/features/project/overview/models';

import {
  FunderOption,
  FundingDialogResult,
  FundingEntryData,
  FundingEntryForm,
  FundingForm,
  SupplementData,
} from '../../models';
import { GetFundersList } from '../../store/project-metadata.actions';

@Component({
  selector: 'osf-funding-dialog',
  imports: [Button, Select, InputText, TranslatePipe, ReactiveFormsModule],
  templateUrl: './funding-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundingDialogComponent implements OnInit {
  protected dialogRef = inject(DynamicDialogRef);
  protected config = inject(DynamicDialogConfig);
  protected destroyRef = inject(DestroyRef);

  private searchSubject = new Subject<string>();

  protected actions = createDispatchMap({
    getFundersList: GetFundersList,
  });

  protected fundersList = select(ProjectMetadataSelectors.getFundersList);
  protected fundersLoading = select(ProjectMetadataSelectors.getFundersLoading);
  protected funderOptions = signal<FunderOption[]>([]);

  fundingForm = new FormGroup<FundingForm>({
    fundingEntries: new FormArray<FormGroup<FundingEntryForm>>([]),
  });

  constructor() {
    effect(() => {
      const funders = this.fundersList() || [];
      this.funderOptions.set(
        funders.map((funder) => ({
          label: funder.name,
          value: funder.name,
          id: funder.id,
          uri: funder.uri,
        }))
      );
    });

    effect(() => {
      const control = this.fundingForm.controls['fundingEntries'];

      return this.fundersLoading() ? control.disable() : control.enable();
    });
  }

  get currentProject(): ProjectOverview | null {
    return this.config.data ? this.config.data.currentProject || null : null;
  }

  get fundingEntries() {
    return this.fundingForm.get('fundingEntries') as FormArray<FormGroup<FundingEntryForm>>;
  }

  ngOnInit(): void {
    this.actions.getFundersList();

    this.addFundingEntry();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchQuery) => {
        this.actions.getFundersList(searchQuery);
      });
  }

  onFunderSearch(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  private createFundingEntryGroup(supplement?: SupplementData): FormGroup<FundingEntryForm> {
    return new FormGroup<FundingEntryForm>({
      funderName: new FormControl(supplement ? supplement.funderName || '' : '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      funderIdentifier: new FormControl(supplement ? supplement.funderIdentifier || '' : '', {
        nonNullable: true,
      }),
      funderIdentifierType: new FormControl(supplement ? supplement.funderIdentifierType || 'DOI' : 'DOI', {
        nonNullable: true,
      }),
      awardTitle: new FormControl(supplement ? supplement.title || supplement.awardTitle || '' : '', {
        nonNullable: true,
      }),
      awardUri: new FormControl(supplement ? supplement.url || supplement.awardUri || '' : '', {
        nonNullable: true,
      }),
      awardNumber: new FormControl(supplement ? supplement.awardNumber || '' : '', {
        nonNullable: true,
      }),
    });
  }

  addFundingEntry(supplement?: SupplementData): void {
    const entry = this.createFundingEntryGroup(supplement);
    this.fundingEntries.push(entry);
  }

  removeFundingEntry(index: number): void {
    if (this.fundingEntries.length > 1) {
      this.fundingEntries.removeAt(index);
    }
  }

  onFunderSelected(selectedFunderName: string, index: number): void {
    const funders = this.fundersList() || [];
    const selectedFunder = funders.find((funder) => funder.name === selectedFunderName);

    if (selectedFunder) {
      const entry = this.fundingEntries.at(index);
      entry.patchValue({
        funderName: selectedFunder.name,
        funderIdentifier: selectedFunder.id,
        funderIdentifierType: 'DOI',
      });
    }
  }

  save(): void {
    if (this.fundingForm.valid) {
      const fundingData = this.fundingEntries.value.filter((entry): entry is FundingEntryData =>
        Boolean(entry && (entry.funderName || entry.awardTitle || entry.awardUri || entry.awardNumber))
      );

      const result: FundingDialogResult = {
        fundingEntries: fundingData,
        projectId: this.currentProject ? this.currentProject.id : undefined,
      };

      this.dialogRef.close(result);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
