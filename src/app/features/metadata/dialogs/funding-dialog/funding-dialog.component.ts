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

import { CustomValidators } from '@osf/shared/helpers';

import { Funder, FunderOption, FundingDialogResult, FundingEntryForm, FundingForm, SupplementData } from '../../models';
import { GetFundersList, MetadataSelectors } from '../../store';

@Component({
  selector: 'osf-funding-dialog',
  imports: [Button, Select, InputText, TranslatePipe, ReactiveFormsModule],
  templateUrl: './funding-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundingDialogComponent implements OnInit {
  dialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  destroyRef = inject(DestroyRef);

  actions = createDispatchMap({ getFundersList: GetFundersList });

  fundersList = select(MetadataSelectors.getFundersList);
  fundersLoading = select(MetadataSelectors.getFundersLoading);
  funderOptions = signal<FunderOption[]>([]);

  fundingForm = new FormGroup<FundingForm>({ fundingEntries: new FormArray<FormGroup<FundingEntryForm>>([]) });

  private searchSubject = new Subject<string>();

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

  get fundingEntries() {
    return this.fundingForm.get('fundingEntries') as FormArray<FormGroup<FundingEntryForm>>;
  }

  ngOnInit(): void {
    this.actions.getFundersList();

    const configFunders = this.config.data?.funders;
    if (configFunders?.length > 0) {
      configFunders.forEach((funder: Funder) => {
        this.addFundingEntry({
          funderName: funder.funderName || '',
          funderIdentifier: funder.funderIdentifier || '',
          funderIdentifierType: funder.funderIdentifierType || 'DOI',
          awardTitle: funder.awardTitle || '',
          awardUri: funder.awardUri || '',
          awardNumber: funder.awardNumber || '',
        });
      });
    } else {
      this.addFundingEntry();
    }

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchQuery) => this.actions.getFundersList(searchQuery));
  }

  onFunderSearch(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  private createFundingEntryGroup(supplement?: SupplementData): FormGroup<FundingEntryForm> {
    return new FormGroup<FundingEntryForm>({
      funderName: new FormControl(supplement?.funderName ?? null, {
        validators: [Validators.required],
      }),
      funderIdentifier: new FormControl(supplement?.funderIdentifier ?? '', {
        nonNullable: true,
      }),
      funderIdentifierType: new FormControl(supplement?.funderIdentifierType ?? 'DOI', {
        nonNullable: true,
      }),
      awardTitle: new FormControl(supplement?.title || supplement?.awardTitle || '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      awardUri: new FormControl(supplement?.url || supplement?.awardUri || '', {
        nonNullable: true,
        validators: [CustomValidators.linkValidator(), CustomValidators.requiredTrimmed()],
      }),
      awardNumber: new FormControl(supplement?.awardNumber || '', {
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
        funderIdentifier: selectedFunder.uri,
        funderIdentifierType: 'Crossref Funder ID',
      });
    }
  }

  save(): void {
    if (this.fundingForm.valid) {
      const fundingData = this.fundingEntries.value.filter((entry): entry is Funder =>
        Boolean(entry && (entry.funderName || entry.awardTitle || entry.awardUri || entry.awardNumber))
      );
      const result: FundingDialogResult = {
        fundingEntries: fundingData,
      };

      this.dialogRef.close(result);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
