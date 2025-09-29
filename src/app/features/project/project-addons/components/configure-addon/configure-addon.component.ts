import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
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

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { SubHeaderComponent } from '@osf/shared/components';
import { StorageItemSelectorComponent } from '@osf/shared/components/addons';
import { AddonServiceNames, AddonType, OperationNames } from '@osf/shared/enums';
import { getAddonTypeString } from '@osf/shared/helpers';
import { AddonModel, ConfiguredAddonModel } from '@osf/shared/models';
import { AddonFormService, AddonOperationInvocationService, ToastService } from '@osf/shared/services';
import {
  AddonsSelectors,
  ClearOperationInvocations,
  CreateAddonOperationInvocation,
  GetLinkAddons,
  UpdateConfiguredAddon,
} from '@osf/shared/stores';

import { AddonDialogService } from '../../services/addon-dialog.service';

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
    StorageItemSelectorComponent,
  ],
  templateUrl: './configure-addon.component.html',
  styleUrl: './configure-addon.component.scss',
  providers: [AddonDialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureAddonComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private addonDialogService = inject(AddonDialogService);
  private addonFormService = inject(AddonFormService);
  private operationInvocationService = inject(AddonOperationInvocationService);
  private store = inject(Store);
  private readonly environment = inject(ENVIRONMENT);

  accountNameControl = new FormControl('');
  storageAddon = signal<AddonModel | null>(null);
  addon = signal<ConfiguredAddonModel | null>(null);

  readonly isGoogleDrive = computed(() => this.storageAddon()?.wbKey === 'googledrive');

  isEditMode = signal<boolean>(false);
  selectedStorageItemId = signal('');
  selectedStorageItemUrl = signal('');
  selectedResourceType = signal('');
  addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  operationInvocation = select(AddonsSelectors.getOperationInvocation);
  linkAddons = select(AddonsSelectors.getLinkAddons);
  selectedStorageItem = select(AddonsSelectors.getSelectedStorageItem);

  addonServiceName = computed(
    () => AddonServiceNames[this.addon()?.externalServiceName as keyof typeof AddonServiceNames]
  );

  readonly baseUrl = computed(() => {
    const currentUrl = this.router.url;
    return currentUrl.split('/addons')[0];
  });
  readonly resourceUri = computed(() => {
    const id = this.route.parent?.parent?.snapshot.params['id'];
    return `${this.environment.webUrl}/${id}`;
  });
  readonly addonTypeString = computed(() => {
    return getAddonTypeString(this.addon());
  });
  readonly selectedItemLabel = computed(() => {
    const addonType = this.addonTypeString();
    return addonType === AddonType.LINK
      ? 'settings.addons.configureAddon.linkedItem'
      : 'settings.addons.configureAddon.selectedFolder';
  });
  readonly supportedResourceTypes = computed(() => {
    if (this.linkAddons().length && this.addonTypeString() === AddonType.LINK) {
      const addon = this.linkAddons().find((a) => this.addon()?.externalServiceName === a.externalServiceName);
      return addon?.supportedResourceTypes || [];
    }
    return [];
  });
  readonly actions = createDispatchMap({
    createAddonOperationInvocation: CreateAddonOperationInvocation,
    updateConfiguredAddon: UpdateConfiguredAddon,
    clearOperationInvocations: ClearOperationInvocations,
    getLinkAddons: GetLinkAddons,
  });

  constructor() {
    this.initializeAddon();

    effect(() => {
      this.destroyRef.onDestroy(() => {
        this.actions.clearOperationInvocations();
      });
    });

    effect(() => {
      if (this.addonTypeString() === AddonType.LINK) {
        this.actions.getLinkAddons();
      }
    });
  }

  private initializeAddon(): void {
    // TODO this should be reviewed to have the addon be retrieved from the store
    // I have limited my testing because it will create a false/positive test based on the required data
    const addon = this.router.getCurrentNavigation()?.extras.state?.['addon'] as ConfiguredAddonModel;

    if (addon) {
      this.storageAddon.set(
        this.store.selectSnapshot(AddonsSelectors.getStorageAddon(addon.externalStorageServiceId || ''))
      );

      this.addon.set(addon);
      this.selectedStorageItemId.set(addon.selectedStorageItemId);
      this.selectedStorageItemUrl.set(addon.targetUrl || '');
      this.selectedResourceType.set(addon.resourceType || '');
      this.accountNameControl.setValue(addon.displayName);
    } else {
      this.router.navigate([`${this.baseUrl()}/addons`]);
    }
  }

  handleCreateOperationInvocation(operationName: OperationNames, folderId: string): void {
    const addon = this.addon();
    if (!addon) return;

    const payload = this.operationInvocationService.createOperationInvocationPayload(addon, operationName, folderId);

    this.actions.createAddonOperationInvocation(payload);
  }

  ngOnInit(): void {
    this.handleCreateOperationInvocation(OperationNames.GET_ITEM_INFO, this.selectedStorageItemId());
  }

  handleDisconnectAccount(): void {
    const currentAddon = this.addon();
    if (!currentAddon) return;

    this.openDisconnectDialog(currentAddon);
  }

  private openDisconnectDialog(addon: ConfiguredAddonModel): void {
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

  toggleEditMode(): void {
    if (!this.isEditMode()) {
      this.resetConfigurationForm();
    }

    this.handleCreateOperationInvocation(OperationNames.LIST_ROOT_ITEMS, this.selectedStorageItemId());
    this.isEditMode.set(!this.isEditMode());
  }

  handleUpdateAddonConfiguration(): void {
    const currentAddon = this.addon();
    if (!currentAddon) return;

    const payload = this.addonFormService.generateConfiguredAddonUpdatePayload(
      currentAddon,
      this.addonsUserReference()[0].id || '',
      this.resourceUri(),
      this.accountNameControl.value || '',
      this.selectedStorageItemId() || '',
      this.addonTypeString(),
      this.selectedResourceType(),
      this.selectedStorageItemUrl()
    );

    this.actions.updateConfiguredAddon(payload, this.addonTypeString(), currentAddon.id).subscribe({
      complete: () => {
        this.router.navigate([`${this.baseUrl()}/addons`]);
        this.toastService.showSuccess('settings.addons.toast.updateSuccess', {
          addonName: this.addonServiceName(),
        });
      },
    });
  }

  private resetConfigurationForm(): void {
    this.selectedStorageItemId.set('');
    this.selectedStorageItemUrl.set('');
    const currentAddon = this.addon();
    if (currentAddon) {
      this.selectedResourceType.set(currentAddon.resourceType || '');
      this.accountNameControl.setValue(currentAddon.displayName);
    }
  }
}
