import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { TableModule } from 'primeng/table';

import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { OperationNames } from '@osf/features/project/addons/enums';
import { AddonConfigMap } from '@osf/features/project/addons/utils';
import { SubHeaderComponent } from '@osf/shared/components';
import { ProjectAddonsStepperValue } from '@osf/shared/enums';
import {
  AddonSetupAccountFormComponent,
  AddonTermsComponent,
  FolderSelectorComponent,
} from '@shared/components/addons';
import { Addon, AddonTerm, AuthorizedAddon, AuthorizedAddonRequestJsonApi } from '@shared/models';
import { AddonDialogService, AddonFormService, AddonOperationInvocationService, ToastService } from '@shared/services';
import {
  AddonsSelectors,
  CreateAddonOperationInvocation,
  CreateAuthorizedAddon,
  CreateConfiguredAddon,
  GetAuthorizedCitationAddons,
  GetAuthorizedStorageAddons,
  UpdateAuthorizedAddon,
  UpdateConfiguredAddon,
} from '@shared/stores/addons';
import { getAddonTypeString } from '@shared/utils';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-connect-configured-addon',
  imports: [
    SubHeaderComponent,
    StepPanel,
    StepPanels,
    Stepper,
    Button,
    TableModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    RadioButtonModule,
    FolderSelectorComponent,
    AddonTermsComponent,
    AddonSetupAccountFormComponent,
    DialogModule,
    DynamicDialogModule,
  ],
  templateUrl: './connect-configured-addon.component.html',
  providers: [RadioButtonModule, DialogService, AddonDialogService],
  styleUrl: './connect-configured-addon.component.scss',
})
export class ConnectConfiguredAddonComponent {
  private translateService = inject(TranslateService);
  private toastService = inject(ToastService);
  private addonDialogService = inject(AddonDialogService);
  private addonFormService = inject(AddonFormService);
  private operationInvocationService = inject(AddonOperationInvocationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected readonly AddonStepperValue = ProjectAddonsStepperValue;
  protected readonly stepper = viewChild(Stepper);
  protected accountNameControl = new FormControl('');
  protected terms = signal<AddonTerm[]>([]);
  protected addon = signal<Addon | AuthorizedAddon | null>(null);
  protected addonAuthUrl = signal<string>('/settings/addons');
  protected currentAuthorizedAddonAccounts = signal<AuthorizedAddon[]>([]);
  protected chosenAccountId = signal('');
  protected chosenAccountName = signal('');
  protected selectedRootFolderId = signal('');

  protected addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  protected createdAuthorizedAddon = select(AddonsSelectors.getCreatedOrUpdatedAuthorizedAddon);
  protected createdConfiguredAddon = select(AddonsSelectors.getCreatedOrUpdatedConfiguredAddon);
  protected authorizedStorageAddons = select(AddonsSelectors.getAuthorizedStorageAddons);
  protected authorizedCitationAddons = select(AddonsSelectors.getAuthorizedCitationAddons);
  protected operationInvocation = select(AddonsSelectors.getOperationInvocation);

  protected isAuthorizedStorageAddonsLoading = select(AddonsSelectors.getAuthorizedStorageAddonsLoading);
  protected isAuthorizedCitationAddonsLoading = select(AddonsSelectors.getAuthorizedCitationAddonsLoading);
  protected isCreatingAuthorizedAddon = select(AddonsSelectors.getCreatedOrUpdatedStorageAddonSubmitting);

  protected actions = createDispatchMap({
    getAuthorizedStorageAddons: GetAuthorizedStorageAddons,
    getAuthorizedCitationAddons: GetAuthorizedCitationAddons,
    createAuthorizedAddon: CreateAuthorizedAddon,
    createConfiguredAddon: CreateConfiguredAddon,
    updateConfiguredAddon: UpdateConfiguredAddon,
    updateAuthorizedAddon: UpdateAuthorizedAddon,
    createAddonOperationInvocation: CreateAddonOperationInvocation,
  });

  protected readonly userReferenceId = computed(() => {
    return this.addonsUserReference()[0]?.id;
  });

  protected loginOrChooseAccountText = computed(() => {
    return this.translateService.instant('settings.addons.connectAddon.loginToOrSelectAccount', {
      addonName: this.addon()?.displayName,
    });
  });

  protected resourceUri = computed(() => {
    const id = this.route.parent?.parent?.snapshot.params['id'];

    return `${environment.baseResourceUri}${id}`;
  });

  protected addonTypeString = computed(() => {
    return getAddonTypeString(this.addon());
  });

  protected readonly baseUrl = computed(() => {
    const currentUrl = this.router.url;
    return currentUrl.split('/addons')[0];
  });

  constructor() {
    const addon = this.router.getCurrentNavigation()?.extras.state?.['addon'] as Addon | AuthorizedAddon;
    if (!addon) {
      this.router.navigate([`${this.baseUrl()}/addons`]);
    }
    this.addon.set(addon);
  }

  protected handleCreateConfiguredAddon() {
    const addon = this.addon();
    const selectedAccount = this.currentAuthorizedAddonAccounts().find(
      (account) => account.id === this.chosenAccountId()
    );
    if (!addon || !selectedAccount) return;

    const payload = this.addonFormService.generateConfiguredAddonCreatePayload(
      addon,
      selectedAccount,
      this.userReferenceId(),
      this.resourceUri(),
      this.accountNameControl.value || '',
      this.selectedRootFolderId(),
      this.addonTypeString()
    );

    this.actions.createConfiguredAddon(payload, this.addonTypeString()).subscribe({
      complete: () => {
        const createdAddon = this.createdConfiguredAddon();
        if (createdAddon) {
          this.router.navigate([`${this.baseUrl()}/addons`]);
          this.toastService.showSuccess('settings.addons.toast.createSuccess', {
            addonName: addon.externalServiceName,
          });
        }
      },
    });
  }

  protected handleCreateAuthorizedAddon(payload: AuthorizedAddonRequestJsonApi): void {
    if (!this.addon()) return;

    this.actions.createAuthorizedAddon(payload, this.addonTypeString()).subscribe({
      complete: () => {
        const createdAddon = this.createdAuthorizedAddon();
        if (createdAddon) {
          this.addonAuthUrl.set(createdAddon.attributes.auth_url);
          window.open(createdAddon.attributes.auth_url, '_blank');
          this.stepper()?.value.set(ProjectAddonsStepperValue.AUTH);
        }
      },
    });
  }

  protected handleConfirmAccountConnection(): void {
    const selectedAccount = this.currentAuthorizedAddonAccounts().find(
      (account) => account.id === this.chosenAccountId()
    );

    if (!selectedAccount) return;

    const dialogRef = this.addonDialogService.openConfirmAccountConnectionDialog(selectedAccount);

    dialogRef.subscribe((result) => {
      if (result?.success) {
        this.stepper()?.value.set(ProjectAddonsStepperValue.CONFIGURE_ROOT_FOLDER);
        this.chosenAccountName.set(selectedAccount.displayName);
        this.accountNameControl.setValue(selectedAccount.displayName);
      }
    });
  }

  protected handleAuthorizedAccountsPresenceCheck() {
    const requiredData = this.getDataForAccountCheck();
    if (!requiredData) return;

    const { addonType, referenceId, currentAddon } = requiredData;
    const addonConfig = this.getAddonConfig(addonType, referenceId);

    if (!addonConfig) return;

    addonConfig.getAddons().subscribe({
      complete: () => {
        this.processAuthorizedAddons(addonConfig, currentAddon);
      },
    });
  }

  private getDataForAccountCheck() {
    const addonType = this.addonTypeString();
    const referenceId = this.userReferenceId();
    const currentAddon = this.addon();

    if (!addonType || !referenceId || !currentAddon) {
      return null;
    }

    return { addonType, referenceId, currentAddon };
  }

  private getAddonConfig(addonType: string, referenceId: string) {
    const addonConfigMap: AddonConfigMap = {
      storage: {
        getAddons: () => this.actions.getAuthorizedStorageAddons(referenceId),
        getAuthorizedAddons: () => this.authorizedStorageAddons(),
      },
      citation: {
        getAddons: () => this.actions.getAuthorizedCitationAddons(referenceId),
        getAuthorizedAddons: () => this.authorizedCitationAddons(),
      },
    };

    return addonConfigMap[addonType] || null;
  }

  private processAuthorizedAddons(
    addonConfig: AddonConfigMap[keyof AddonConfigMap],
    currentAddon: Addon | AuthorizedAddon
  ) {
    const authorizedAddons = addonConfig.getAuthorizedAddons();
    const matchingAddons = this.findMatchingAddons(authorizedAddons, currentAddon);

    if (matchingAddons.length > 0) {
      this.currentAuthorizedAddonAccounts.set(matchingAddons);
    }

    const nextStep =
      matchingAddons.length > 0
        ? ProjectAddonsStepperValue.CHOOSE_CONNECTION
        : ProjectAddonsStepperValue.SETUP_NEW_ACCOUNT;

    this.stepper()?.value.set(nextStep);
  }

  private findMatchingAddons(
    authorizedAddons: AuthorizedAddon[],
    currentAddon: Addon | AuthorizedAddon
  ): AuthorizedAddon[] {
    return authorizedAddons.filter((addon) => addon.externalServiceName === currentAddon.externalServiceName);
  }

  protected handleCreateOperationInvocation(operationName: OperationNames, itemId: string): void {
    const selectedAccount = this.currentAuthorizedAddonAccounts().find(
      (account) => account.id === this.chosenAccountId()
    );

    if (!selectedAccount) return;

    const payload = this.operationInvocationService.createInitialOperationInvocationPayload(
      operationName,
      selectedAccount,
      itemId
    );

    this.actions.createAddonOperationInvocation(payload);
  }
}
