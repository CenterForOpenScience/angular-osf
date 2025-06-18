import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { OperationNames } from '@osf/features/project/addons/enums';
import { SubHeaderComponent } from '@shared/components';
import { FolderSelectorComponent } from '@shared/components/addons/folder-selector/folder-selector.component';
import { ConfiguredAddon } from '@shared/models';
import { AddonDialogService, AddonFormService, AddonOperationInvocationService, ToastService } from '@shared/services';
import {
  AddonsSelectors,
  ClearOperationInvocations,
  CreateAddonOperationInvocation,
  UpdateConfiguredAddon,
} from '@shared/stores/addons';

@Component({
  selector: 'osf-configure-addon',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    Button,
    RouterLink,
    Card,
    ReactiveFormsModule,
    FormsModule,
    Skeleton,
    BreadcrumbModule,
    FolderSelectorComponent,
  ],
  templateUrl: './configure-addon.component.html',
  styleUrl: './configure-addon.component.scss',
  providers: [DialogService, AddonDialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureAddonComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private addonDialogService = inject(AddonDialogService);
  private addonFormService = inject(AddonFormService);
  private operationInvocationService = inject(AddonOperationInvocationService);

  protected accountNameControl = new FormControl('');
  protected addon = signal<ConfiguredAddon | null>(null);
  protected isEditMode = signal<boolean>(false);
  protected selectedRootFolderId = signal('');
  protected addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  protected operationInvocation = select(AddonsSelectors.getOperationInvocation);
  protected selectedFolderOperationInvocation = select(AddonsSelectors.getSelectedFolderOperationInvocation);
  protected selectedFolder = select(AddonsSelectors.getSelectedFolder);

  protected readonly baseUrl = computed(() => {
    const currentUrl = this.router.url;
    return currentUrl.split('/addons')[0];
  });
  protected readonly resourceUri = computed(() => {
    const id = this.route.parent?.parent?.snapshot.params['id'];
    return `https://staging4.osf.io/${id}`;
  });
  protected readonly addonTypeString = computed(() => {
    const addon = this.addon();
    return addon?.type === 'configured-storage-addons' ? 'storage' : 'citation';
  });
  protected readonly actions = createDispatchMap({
    createAddonOperationInvocation: CreateAddonOperationInvocation,
    updateConfiguredAddon: UpdateConfiguredAddon,
    clearOperationInvocations: ClearOperationInvocations,
  });

  constructor() {
    this.initializeAddon();

    effect(() => {
      this.destroyRef.onDestroy(() => {
        this.actions.clearOperationInvocations();
      });
    });
  }

  private initializeAddon(): void {
    const addon = this.router.getCurrentNavigation()?.extras.state?.['addon'] as ConfiguredAddon;

    if (addon) {
      this.addon.set(addon);
      this.selectedRootFolderId.set(addon.selectedFolderId);
      this.accountNameControl.setValue(addon.displayName);
    } else {
      this.router.navigate([`${this.baseUrl()}/addons`]);
    }
  }

  protected handleCreateOperationInvocation(operationName: OperationNames, folderId: string): void {
    const addon = this.addon();
    if (!addon) return;

    const payload = this.operationInvocationService.createOperationInvocationPayload(addon, operationName, folderId);

    this.actions.createAddonOperationInvocation(payload);
  }

  ngOnInit(): void {
    this.handleCreateOperationInvocation(OperationNames.GET_ITEM_INFO, this.selectedRootFolderId());
  }

  protected handleDisconnectAccount(): void {
    const currentAddon = this.addon();
    if (!currentAddon) return;

    this.openDisconnectDialog(currentAddon);
  }

  private openDisconnectDialog(addon: ConfiguredAddon): void {
    const dialogRef = this.addonDialogService.openDisconnectDialog(addon);

    dialogRef.subscribe((result) => {
      if (result?.success) {
        this.router.navigate([`${this.baseUrl()}/addons`]);
        this.toastService.showSuccess('settings.addons.toast.disconnectSuccess', {
          addonName: this.addon()?.displayName,
        });
      }
    });
  }

  protected toggleEditMode(): void {
    const operationResult = this.selectedFolderOperationInvocation()?.operationResult[0];
    const hasRootCandidates = operationResult?.mayContainRootCandidates ?? false;
    const itemId = operationResult?.itemId || '/';

    this.handleCreateOperationInvocation(
      hasRootCandidates ? OperationNames.LIST_CHILD_ITEMS : OperationNames.GET_ITEM_INFO,
      itemId
    );
    this.isEditMode.set(!this.isEditMode());
  }

  protected handleUpdateAddonConfiguration(): void {
    const currentAddon = this.addon();
    if (!currentAddon) return;

    const payload = this.addonFormService.generateConfiguredAddonUpdatePayload(
      currentAddon,
      this.addonsUserReference()[0].id || '',
      this.resourceUri(),
      this.accountNameControl.value || '',
      this.selectedRootFolderId() || '',
      this.addonTypeString()
    );

    this.store.dispatch(new UpdateConfiguredAddon(payload, this.addonTypeString(), currentAddon.id)).subscribe({
      complete: () => {
        this.router.navigate([`${this.baseUrl()}/addons`]);
        this.toastService.showSuccess('settings.addons.toast.updateSuccess', {
          addonName: currentAddon.externalServiceName,
        });
      },
    });
  }
}
