import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { Skeleton } from 'primeng/skeleton';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OperationNames } from '@osf/features/project/addons/enums';
import { OperationInvokeData, StorageItem } from '@shared/models';
import { AddonsSelectors } from '@shared/stores/addons';

@Component({
  selector: 'osf-folder-selector',
  templateUrl: './folder-selector.component.html',
  styleUrl: './folder-selector.component.scss',
  imports: [
    TranslatePipe,
    Button,
    Card,
    InputText,
    RadioButton,
    ReactiveFormsModule,
    Skeleton,
    BreadcrumbModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderSelectorComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private translateService = inject(TranslateService);
  accountName = input.required<string>();
  operationInvocationResult = input.required<StorageItem[]>();
  accountNameControl = input(new FormControl());
  isCreateMode = input(false);
  selectedRootFolderId = model<string>('/');
  operationInvoke = output<OperationInvokeData>();
  save = output<void>();
  cancelSelection = output<void>();
  protected readonly OperationNames = OperationNames;
  protected hasInputChanged = signal(false);
  protected hasFolderChanged = signal(false);
  protected selectedRootFolder = signal<StorageItem | null>(null);
  protected breadcrumbItems = signal<MenuItem[]>([]);
  protected initiallySelectedFolder = select(AddonsSelectors.getSelectedFolder);
  protected isOperationInvocationSubmitting = select(AddonsSelectors.getOperationInvocationSubmitting);
  protected isSubmitting = select(AddonsSelectors.getCreatedOrUpdatedConfiguredAddonSubmitting);
  protected readonly homeBreadcrumb: MenuItem = {
    id: '/',
    label: this.translateService.instant('settings.addons.configureAddon.home'),
    state: {
      operationName: OperationNames.LIST_ROOT_ITEMS,
    },
  };

  constructor() {
    effect(() => {
      const initialFolder = this.initiallySelectedFolder();
      if (initialFolder && !this.selectedRootFolder()) {
        this.selectedRootFolder.set(initialFolder);
      }
    });
  }

  ngOnInit(): void {
    this.accountNameControl()
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newValue) => {
        this.hasInputChanged.set(newValue !== this.accountName());
      });
  }

  protected readonly isFormValid = computed(() => {
    return this.isCreateMode() ? this.hasFolderChanged() : this.hasInputChanged() || this.hasFolderChanged();
  });

  protected handleCreateOperationInvocation(
    operationName: OperationNames,
    itemId: string,
    itemName?: string,
    mayContainRootCandidates?: boolean
  ): void {
    this.updateBreadcrumbs(operationName, itemId, itemName, mayContainRootCandidates);

    this.operationInvoke.emit({
      operationName,
      itemId,
    });

    this.trimBreadcrumbs(itemId);
  }

  protected handleSave(): void {
    this.selectedRootFolderId.set(this.selectedRootFolder()?.itemId || '');
    this.save.emit();
  }

  protected handleCancel(): void {
    this.cancelSelection.emit();
  }

  protected handleFolderSelection(folder: StorageItem): void {
    this.selectedRootFolder.set(folder);
    this.hasFolderChanged.set(folder?.itemId !== this.initiallySelectedFolder()?.itemId);
  }

  private updateBreadcrumbs(
    operationName: OperationNames,
    itemId: string,
    itemName?: string,
    mayContainRootCandidates?: boolean
  ): void {
    if (operationName === OperationNames.LIST_ROOT_ITEMS) {
      this.breadcrumbItems.set([]);
      return;
    }

    if (itemName && mayContainRootCandidates) {
      const breadcrumbs = [...this.breadcrumbItems()];
      const item = {
        id: itemId,
        label: itemName,
        state: {
          operationName: mayContainRootCandidates ? OperationNames.LIST_CHILD_ITEMS : OperationNames.GET_ITEM_INFO,
        },
      };

      this.breadcrumbItems.set([...breadcrumbs, item]);
    }
  }

  private trimBreadcrumbs(itemId: string): void {
    const currentBreadcrumbs = this.breadcrumbItems();

    const targetIndex = currentBreadcrumbs.findIndex((item) => item.id === itemId);

    if (targetIndex !== -1) {
      const trimmedBreadcrumbs = currentBreadcrumbs.slice(0, targetIndex + 1);
      this.breadcrumbItems.set(trimmedBreadcrumbs);
    }
  }
}
