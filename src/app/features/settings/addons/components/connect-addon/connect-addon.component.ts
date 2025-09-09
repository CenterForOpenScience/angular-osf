import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { TableModule } from 'primeng/table';

import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components';
import { AddonServiceNames, ProjectAddonsStepperValue } from '@osf/shared/enums';
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

  protected readonly stepper = viewChild(Stepper);
  protected readonly ProjectAddonsStepperValue = ProjectAddonsStepperValue;

  protected terms = signal<AddonTerm[]>([]);
  protected addon = signal<AddonModel | AuthorizedAccountModel | null>(null);
  protected addonAuthUrl = signal<string>('/settings/addons');

  protected addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  protected createdAddon = select(AddonsSelectors.getCreatedOrUpdatedAuthorizedAddon);
  protected isCreatingAuthorizedAddon = select(AddonsSelectors.getCreatedOrUpdatedStorageAddonSubmitting);
  protected isAuthorized = computed(() => {
    return isAuthorizedAddon(this.addon());
  });
  protected addonTypeString = computed(() => {
    return getAddonTypeString(this.addon());
  });

  protected actions = createDispatchMap({
    createAuthorizedAddon: CreateAuthorizedAddon,
    updateAuthorizedAddon: UpdateAuthorizedAddon,
  });

  protected readonly userReferenceId = computed(() => {
    return this.addonsUserReference()[0]?.id;
  });
  protected readonly baseUrl = computed(() => {
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
