import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DisconnectAddonModalComponent } from '@osf/features/project/addons/components';
import { OperationNames } from '@osf/features/project/addons/enums';
import { SubHeaderComponent } from '@shared/components';
import { ConfiguredAddon, ConfiguredAddonRequestJsonApi, OperationInvocationRequestJsonApi } from '@shared/models';
import { AddonsSelectors, CreateAddonOperationInvocation, UpdateConfiguredAddon } from '@shared/stores/addons';

@Component({
  selector: 'osf-configure-addon',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    Button,
    RouterLink,
    Card,
    InputText,
    RadioButton,
    ReactiveFormsModule,
    FormsModule,
    Skeleton,
    BreadcrumbModule,
  ],
  templateUrl: './configure-addon.component.html',
  styleUrl: './configure-addon.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureAddonComponent implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  protected readonly OperationNames = OperationNames;
  protected accountNameControl = new FormControl('');
  protected addon = signal<ConfiguredAddon | null>(null);
  protected isEditMode = signal<boolean>(false);
  protected chosenRootFolderId = signal('');
  protected addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  protected operationInvocation = select(AddonsSelectors.getOperationInvocation);
  protected selectedFolderName = select(AddonsSelectors.getSelectedFolderName);

  protected isOperationInvocationSubmitting = select(AddonsSelectors.getOperationInvocationSubmitting);
  protected isAddonUpdateSubmitting = select(AddonsSelectors.getCreatedOrUpdatedConfiguredAddonSubmitting);

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
  });
  protected breadcrumbItems = signal<MenuItem[]>([]);
  protected homeBreadcrumb: MenuItem = {
    id: '/',
    label: this.translateService.instant('settings.addons.configureAddon.home'),
    state: {
      operationName: OperationNames.LIST_ROOT_ITEMS,
    },
  };

  constructor() {
    this.initializeAddon();
  }

  private initializeAddon(): void {
    const addon = this.router.getCurrentNavigation()?.extras.state?.['addon'] as ConfiguredAddon;

    if (addon) {
      this.addon.set(addon);
      this.accountNameControl.setValue(addon.displayName);
      this.chosenRootFolderId.set(addon.selectedFolderId);
    } else {
      this.router.navigate([`${this.baseUrl()}/addons`]);
    }
  }

  protected handleCreateOperationInvocation(
    operationName: OperationNames,
    folderId: string,
    folderName?: string,
    mayContainRootCandidates?: boolean
  ): void {
    const addon = this.addon();
    if (!addon) return;

    const operationKwargs = this.getOperationKwargs(operationName, folderId);

    const payload: OperationInvocationRequestJsonApi = {
      data: {
        type: 'addon-operation-invocations',
        attributes: {
          invocation_status: null,
          operation_name: operationName,
          operation_kwargs: operationKwargs,
          operation_result: {},
          created: null,
          modified: null,
        },
        relationships: {
          thru_addon: {
            data: {
              type: addon.type,
              id: addon.id,
            },
          },
        },
      },
    };

    this.actions.createAddonOperationInvocation(payload).subscribe({
      complete: () => {
        this.handleBreadcrumbUpdate(operationName, folderId, folderName, mayContainRootCandidates);
      },
    });
  }

  private handleBreadcrumbUpdate(
    operationName: OperationNames,
    folderId: string,
    folderName?: string,
    mayContainRootCandidates?: boolean
  ): void {
    if (operationName === OperationNames.LIST_ROOT_ITEMS) {
      this.breadcrumbItems.set([]);
      return;
    }

    if (folderName) {
      const breadcrumbs = [...this.breadcrumbItems()];

      if (mayContainRootCandidates) {
        const item = {
          id: folderId,
          label: folderName,
          state: {
            operationName: mayContainRootCandidates ? OperationNames.LIST_CHILD_ITEMS : OperationNames.GET_ITEM_INFO,
          },
        };

        this.breadcrumbItems.set([...breadcrumbs, { ...item }]);
      }
    }
  }

  ngOnInit(): void {
    this.handleCreateOperationInvocation(OperationNames.GET_ITEM_INFO, this.chosenRootFolderId());
  }

  protected handleDisconnectAccount(): void {
    const currentAddon = this.addon();
    if (!currentAddon) return;

    this.openDisconnectDialog(currentAddon);
  }

  private openDisconnectDialog(addon: ConfiguredAddon): void {
    const dialogRef = this.dialogService.open(DisconnectAddonModalComponent, {
      focusOnShow: false,
      header: this.translateService.instant('settings.addons.configureAddon.disconnect', {
        addonName: addon.externalServiceName,
      }),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        message: this.translateService.instant('settings.addons.configureAddon.disconnectMessage'),
        addon,
      },
    });

    dialogRef.onClose.subscribe((result) => {
      if (result?.success) {
        this.router.navigate([`${this.baseUrl()}/addons`]);
      }
    });
  }

  protected toggleEditMode(): void {
    const operationResult = this.operationInvocation()?.operationResult[0];
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

    const payload = this.generateUpdatePayload(currentAddon);

    this.store.dispatch(new UpdateConfiguredAddon(payload, this.addonTypeString(), currentAddon.id)).subscribe({
      complete: () => this.router.navigate([`${this.baseUrl()}/addons`]),
    });
  }

  private generateUpdatePayload(addon: ConfiguredAddon): ConfiguredAddonRequestJsonApi {
    const addonType = this.addonTypeString();

    const updatePayload = {
      data: {
        id: addon.id,
        type: `configured-${addonType}-addons`,
        attributes: {
          authorized_resource_uri: this.resourceUri(),
          display_name: this.accountNameControl.value || '',
          root_folder: this.chosenRootFolderId(),
          connected_capabilities: ['UPDATE', 'ACCESS'],
          connected_operation_names: ['list_child_items', 'list_root_items', 'get_item_info'],
          external_service_name: addon.externalServiceName,
        },
        relationships: {
          account_owner: {
            data: {
              type: 'user-references',
              id: this.addonsUserReference()[0].id || '',
            },
          },
          base_account: {
            data: {
              type: addon.baseAccountType,
              id: addon.baseAccountId,
            },
          },
          [`external_${addonType}_service`]: {
            data: {
              type: `external-${addonType}-services`,
              id: addon.externalServiceName,
            },
          },
        },
      },
    };

    return updatePayload;
  }

  private getOperationKwargs(operationName: OperationNames, folderId: string): Record<string, unknown> {
    const baseKwargs = operationName !== OperationNames.LIST_ROOT_ITEMS ? { item_id: folderId } : {};

    return {
      ...baseKwargs,
      ...(operationName === OperationNames.LIST_CHILD_ITEMS && { item_type: 'FOLDER' }),
    };
  }
}
