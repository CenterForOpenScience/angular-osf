import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { TableModule } from 'primeng/table';

import { Component, computed, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { OperationNames } from '@osf/features/project/addons/enums';
import { AddonConfigMap } from '@osf/features/project/addons/models';
import { SubHeaderComponent } from '@osf/shared/components';
import { AddonType, ProjectAddonsStepperValue } from '@osf/shared/enums';
import { getAddonTypeString } from '@osf/shared/helpers';
import { AuthorizedAccountModel } from '@osf/shared/models/addons/authorized-account.model';
import {
  AddonSetupAccountFormComponent,
  AddonTermsComponent,
  StorageItemSelectorComponent,
} from '@shared/components/addons';
import { AddonServiceNames } from '@shared/enums';
import { AddonModel, AddonTerm, AuthorizedAddonRequestJsonApi } from '@shared/models';
import {
  AddonDialogService,
  AddonFormService,
  AddonOAuthService,
  AddonOperationInvocationService,
  ToastService,
} from '@shared/services';
import {
  AddonsSelectors,
  CreateAddonOperationInvocation,
  CreateAuthorizedAddon,
  CreateConfiguredAddon,
  GetAuthorizedCitationAddons,
  GetAuthorizedLinkAddons,
  GetAuthorizedStorageAddons,
  UpdateAuthorizedAddon,
  UpdateConfiguredAddon,
} from '@shared/stores/addons';

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
    StorageItemSelectorComponent,
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
  private oauthService = inject(AddonOAuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private selectedAccount = signal<AuthorizedAccountModel>({} as AuthorizedAccountModel);
  readonly isGoogleDrive = computed(() => {
    return this.selectedAccount()?.externalServiceName === 'googledrive';
  });
  readonly AddonStepperValue = ProjectAddonsStepperValue;
  readonly AddonType = AddonType;
  readonly stepper = viewChild(Stepper);
  accountNameControl = new FormControl('');
  terms = signal<AddonTerm[]>([]);
  addon = signal<AddonModel | AuthorizedAccountModel | null>(null);
  addonAuthUrl = signal<string>('/settings/addons');
  currentAuthorizedAddonAccounts = signal<AuthorizedAccountModel[]>([]);
  chosenAccountId = signal('');
  chosenAccountName = signal('');
  selectedStorageItemId = signal('');
  selectedStorageItemUrl = signal('');
  selectedResourceType = signal('');

  addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  createdAuthorizedAddon = select(AddonsSelectors.getCreatedOrUpdatedAuthorizedAddon);
  createdConfiguredAddon = select(AddonsSelectors.getCreatedOrUpdatedConfiguredAddon);
  authorizedStorageAddons = select(AddonsSelectors.getAuthorizedStorageAddons);
  authorizedCitationAddons = select(AddonsSelectors.getAuthorizedCitationAddons);
  authorizedLinkAddons = select(AddonsSelectors.getAuthorizedLinkAddons);
  operationInvocation = select(AddonsSelectors.getOperationInvocation);

  isAuthorizedStorageAddonsLoading = select(AddonsSelectors.getAuthorizedStorageAddonsLoading);
  isAuthorizedCitationAddonsLoading = select(AddonsSelectors.getAuthorizedCitationAddonsLoading);
  isAuthorizedLinkAddonsLoading = select(AddonsSelectors.getAuthorizedLinkAddonsLoading);
  isAuthorizedAddonsLoading = computed(() => {
    return (
      this.isAuthorizedStorageAddonsLoading() ||
      this.isAuthorizedCitationAddonsLoading() ||
      this.isAuthorizedLinkAddonsLoading()
    );
  });
  isCreatingAuthorizedAddon = select(AddonsSelectors.getCreatedOrUpdatedStorageAddonSubmitting);

  actions = createDispatchMap({
    getAuthorizedStorageAddons: GetAuthorizedStorageAddons,
    getAuthorizedCitationAddons: GetAuthorizedCitationAddons,
    getAuthorizedLinkAddons: GetAuthorizedLinkAddons,
    createAuthorizedAddon: CreateAuthorizedAddon,
    createConfiguredAddon: CreateConfiguredAddon,
    updateConfiguredAddon: UpdateConfiguredAddon,
    updateAuthorizedAddon: UpdateAuthorizedAddon,
    createAddonOperationInvocation: CreateAddonOperationInvocation,
  });

  readonly userReferenceId = computed(() => {
    return this.addonsUserReference()[0]?.id;
  });

  loginOrChooseAccountText = computed(() => {
    return this.translateService.instant('settings.addons.connectAddon.loginToOrSelectAccount', {
      addonName: this.addon()?.displayName,
    });
  });

  resourceUri = computed(() => {
    const id = this.route.parent?.parent?.snapshot.params['id'];
    return `${environment.webUrl}/${id}`;
  });

  addonTypeString = computed(() => {
    return getAddonTypeString(this.addon());
  });

  readonly baseUrl = computed(() => {
    const currentUrl = this.router.url;
    return currentUrl.split('/addons')[0];
  });

  readonly supportedResourceTypes = computed(() => {
    const addon = this.addon();
    return addon && 'supportedResourceTypes' in addon ? addon.supportedResourceTypes || [] : [];
  });

  constructor() {
    const addon = this.router.getCurrentNavigation()?.extras.state?.['addon'] as AddonModel | AuthorizedAccountModel;
    if (!addon) {
      this.router.navigate([`${this.baseUrl()}/addons`]);
    }
    this.addon.set(addon);

    this.destroyRef.onDestroy(() => {
      this.oauthService.stopOAuthTracking();
    });
  }

  handleCreateConfiguredAddon() {
    const addon = this.addon();
    this.selectedAccount.set(
      this.currentAuthorizedAddonAccounts().find((account) => account.id === this.chosenAccountId()) ||
        ({} as AuthorizedAccountModel)
    );
    if (!addon || !this.selectedAccount()) return;

    const payload = this.addonFormService.generateConfiguredAddonCreatePayload(
      addon,
      this.selectedAccount(),
      this.userReferenceId(),
      this.resourceUri(),
      this.accountNameControl.value || '',
      this.selectedStorageItemId(),
      this.addonTypeString(),
      this.selectedResourceType(),
      this.selectedStorageItemUrl()
    );

    this.actions.createConfiguredAddon(payload, this.addonTypeString()).subscribe({
      complete: () => {
        const createdAddon = this.createdConfiguredAddon();
        if (createdAddon) {
          this.router.navigate([`${this.baseUrl()}/addons`]);
          this.toastService.showSuccess('settings.addons.toast.createSuccess', {
            addonName: AddonServiceNames[addon.externalServiceName as keyof typeof AddonServiceNames],
          });
        }
      },
    });
  }

  handleCreateAuthorizedAddon(payload: AuthorizedAddonRequestJsonApi): void {
    if (!this.addon()) return;

    this.actions.createAuthorizedAddon(payload, this.addonTypeString()).subscribe({
      complete: () => {
        const createdAddon = this.createdAuthorizedAddon();
        if (createdAddon?.authUrl) {
          this.startOauthFlow(createdAddon);
        } else {
          this.refreshAccountsForOAuth();
        }
      },
    });
  }

  handleConfirmAccountConnection(): void {
    this.selectedAccount.set(
      this.currentAuthorizedAddonAccounts().find((account) => account.id === this.chosenAccountId()) ||
        ({} as AuthorizedAccountModel)
    );

    if (!this.selectedAccount()) return;

    const dialogRef = this.addonDialogService.openConfirmAccountConnectionDialog(this.selectedAccount());

    dialogRef.subscribe((result) => {
      if (result?.success) {
        this.stepper()?.value.set(ProjectAddonsStepperValue.CONFIGURE_ROOT_FOLDER);
        this.chosenAccountName.set(this.selectedAccount().displayName);
        this.accountNameControl.setValue(this.selectedAccount().displayName);
        this.resetConfigurationForm();
      }
    });
  }

  handleAuthorizedAccountsPresenceCheck() {
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
      [AddonType.STORAGE]: {
        getAddons: () => this.actions.getAuthorizedStorageAddons(referenceId),
        getAuthorizedAddons: () => this.authorizedStorageAddons(),
      },
      [AddonType.CITATION]: {
        getAddons: () => this.actions.getAuthorizedCitationAddons(referenceId),
        getAuthorizedAddons: () => this.authorizedCitationAddons(),
      },
      [AddonType.LINK]: {
        getAddons: () => this.actions.getAuthorizedLinkAddons(referenceId),
        getAuthorizedAddons: () => this.authorizedLinkAddons(),
      },
    };

    return addonConfigMap[addonType] || null;
  }

  private processAuthorizedAddons(
    addonConfig: AddonConfigMap[keyof AddonConfigMap],
    currentAddon: AddonModel | AuthorizedAccountModel
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
    authorizedAddons: AuthorizedAccountModel[],
    currentAddon: AddonModel | AuthorizedAccountModel
  ): AuthorizedAccountModel[] {
    return authorizedAddons.filter((addon) => addon.externalServiceName === currentAddon.externalServiceName);
  }

  handleCreateOperationInvocation(operationName: OperationNames, itemId: string): void {
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

  handleNavigateToAccountSelection(): void {
    this.resetConfigurationForm();
    this.stepper()?.value.set(ProjectAddonsStepperValue.CHOOSE_ACCOUNT);
  }

  private resetConfigurationForm(): void {
    this.selectedStorageItemId.set('');
    this.selectedStorageItemUrl.set('');
    this.selectedResourceType.set('');
  }

  private startOauthFlow(createdAddon: AuthorizedAccountModel): void {
    this.addonAuthUrl.set(createdAddon.authUrl!);
    window.open(createdAddon.authUrl!, '_blank');
    this.stepper()?.value.set(ProjectAddonsStepperValue.AUTH);

    this.oauthService.startOAuthTracking(createdAddon, this.addonTypeString(), {
      onSuccess: () => {
        this.refreshAccountsForOAuth();
      },
    });
  }

  private refreshAccountsForOAuth(): void {
    const requiredData = this.getDataForAccountCheck();
    if (!requiredData) return;

    const { addonType, referenceId, currentAddon } = requiredData;
    const addonConfig = this.getAddonConfig(addonType, referenceId);

    if (!addonConfig) return;

    addonConfig.getAddons().subscribe({
      complete: () => {
        const authorizedAddons = addonConfig.getAuthorizedAddons();
        const matchingAddons = this.findMatchingAddons(authorizedAddons, currentAddon);
        this.currentAuthorizedAddonAccounts.set(matchingAddons);

        this.stepper()?.value.set(ProjectAddonsStepperValue.CHOOSE_ACCOUNT);
      },
    });
  }
}
