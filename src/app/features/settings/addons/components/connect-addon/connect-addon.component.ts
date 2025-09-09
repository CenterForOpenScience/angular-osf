import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { TableModule } from 'primeng/table';

import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components';
import { AddonServiceNames, AddonType, ProjectAddonsStepperValue } from '@osf/shared/enums';
import { getAddonTypeString, isAuthorizedAddon } from '@osf/shared/helpers';
import { AddonSetupAccountFormComponent, AddonTermsComponent } from '@shared/components/addons';
import { AddonModel, AddonTerm, AuthorizedAccountModel, AuthorizedAddonRequestJsonApi } from '@shared/models';
import { ToastService } from '@shared/services';
import { AddonsSelectors, CreateAuthorizedAddon, UpdateAuthorizedAddon } from '@shared/stores/addons';

@Component({
  selector: 'osf-connect-addon',
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
    AddonTermsComponent,
    AddonSetupAccountFormComponent,
  ],
  templateUrl: './connect-addon.component.html',
  styleUrl: './connect-addon.component.scss',
})
export class ConnectAddonComponent {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly stepper = viewChild(Stepper);
  readonly AddonType = AddonType;
  readonly ProjectAddonsStepperValue = ProjectAddonsStepperValue;

  terms = signal<AddonTerm[]>([]);
  addon = signal<AddonModel | AuthorizedAccountModel | null>(null);
  addonAuthUrl = signal<string>('/settings/addons');

  addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  createdAddon = select(AddonsSelectors.getCreatedOrUpdatedAuthorizedAddon);
  isCreatingAuthorizedAddon = select(AddonsSelectors.getCreatedOrUpdatedStorageAddonSubmitting);
  isAuthorized = computed(() => {
    return isAuthorizedAddon(this.addon());
  });
  addonTypeString = computed(() => {
    return getAddonTypeString(this.addon());
  });

  actions = createDispatchMap({
    createAuthorizedAddon: CreateAuthorizedAddon,
    updateAuthorizedAddon: UpdateAuthorizedAddon,
  });

  readonly userReferenceId = computed(() => {
    return this.addonsUserReference()[0]?.id;
  });
  readonly baseUrl = computed(() => {
    const currentUrl = this.router.url;
    return currentUrl.split('/addons')[0];
  });

  constructor() {
    const addon = this.router.getCurrentNavigation()?.extras.state?.['addon'] as AddonModel | AuthorizedAccountModel;
    if (!addon) {
      this.router.navigate([`${this.baseUrl()}/addons`]);
    }
    this.addon.set(addon);

    effect(() => {
      if (this.isAuthorized()) {
        this.stepper()?.value.set(ProjectAddonsStepperValue.SETUP_NEW_ACCOUNT);
      }
    });
  }

  handleConnectAuthorizedAddon(payload: AuthorizedAddonRequestJsonApi): void {
    if (!this.addon()) return;

    (!this.isAuthorized()
      ? this.actions.createAuthorizedAddon(payload, this.addonTypeString())
      : this.actions.updateAuthorizedAddon(payload, this.addonTypeString(), this.addon()!.id)
    ).subscribe({
      complete: () => {
        const createdAddon = this.createdAddon();
        if (createdAddon?.authUrl) {
          this.addonAuthUrl.set(createdAddon.authUrl);
          window.open(createdAddon.authUrl, '_blank');
          this.stepper()?.value.set(ProjectAddonsStepperValue.AUTH);
        } else {
          this.router.navigate([`${this.baseUrl()}/addons`]);
          this.toastService.showSuccess('settings.addons.toast.createSuccess', {
            addonName: AddonServiceNames[createdAddon?.externalServiceName as keyof typeof AddonServiceNames],
          });
        }
      },
    });
  }
}
