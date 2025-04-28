import {
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterLink, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Card } from 'primeng/card';
import { RadioButton } from 'primeng/radiobutton';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { Divider } from 'primeng/divider';
import { ADDON_TERMS as addonTerms } from '../utils/addon-terms.const';
import {
  Addon,
  AuthorizedAddon,
  AddonRequest,
} from '@osf/features/settings/addons/entities/addons.entities';
import { CredentialsFormat } from '@osf/features/settings/addons/entities/credentials-format.enum';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Store } from '@ngxs/store';
import {
  AddonsSelectors,
  CreateAuthorizedAddon,
  UpdateAuthorizedAddon,
} from '@core/store/settings/addons';
import {
  AddonForm,
  AddonFormControls,
} from '@osf/features/settings/addons/entities/addon-form.entities';
import { AddonTerm } from '@osf/features/settings/addons/entities/addon-terms.interface';

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
    NgClass,
    Card,
    FormsModule,
    ReactiveFormsModule,
    RadioButton,
    Checkbox,
    Divider,
    InputText,
    Password,
  ],
  templateUrl: './connect-addon.component.html',
  styleUrl: './connect-addon.component.scss',
  standalone: true,
})
export class ConnectAddonComponent {
  protected readonly stepper = viewChild(Stepper);
  // protected readonly selectedFolders = signal<string[]>([]);
  // protected readonly folders: GoogleDriveFolder[] = [
  //   { name: 'folder name example', selected: false },
  //   { name: 'folder name example', selected: false },
  //   { name: 'folder name example', selected: false },
  //   { name: 'folder name example', selected: false },
  //   { name: 'folder name example', selected: false },
  //   { name: 'folder name example', selected: false },
  // ];
  #router = inject(Router);
  #store = inject(Store);
  #fb = inject(FormBuilder);
  protected readonly credentialsFormat = CredentialsFormat;
  protected readonly terms = signal<AddonTerm[]>([]);
  protected readonly addon = signal<Addon | AuthorizedAddon | null>(null);
  protected readonly addonAuthUrl = signal<string>('/settings/addons');
  protected readonly formControls = AddonFormControls;
  protected readonly userReference = this.#store.selectSignal(
    AddonsSelectors.getAddonUserReference,
  );
  protected createdAddon = this.#store.selectSignal(
    AddonsSelectors.getCreatedOrUpdatedStorageAddon,
  );
  protected readonly isConnecting = signal(false);
  protected isAuthorized = computed(() => {
    //check if the addon is already authorized
    const addon = this.addon();
    if (addon) {
      return (
        addon.type === 'authorized-storage-accounts' ||
        addon.type === 'authorized-citation-accounts'
      );
    }
    return false;
  });
  protected readonly addonTypeString = computed(() => {
    //get the addon type string based on the addon type property
    const addon = this.addon();
    if (addon) {
      return addon.type === 'external-storage-services' ||
        addon.type === 'authorized-storage-accounts'
        ? 'storage'
        : 'citation';
    }
    return '';
  });
  protected addonForm: FormGroup<AddonForm>;

  constructor() {
    const terms = this.#getTerms();
    this.terms.set(terms);
    this.addonForm = this.#initializeForm();

    effect(() => {
      if (this.isAuthorized()) {
        this.stepper()?.value.set(2); //if the addon is already authorized, we skip terms table page
      }
    });
  }

  // toggleFolderSelection(folder: GoogleDriveFolder): void {
  //   folder.selected = !folder.selected;
  //   this.selectedFolders.set(
  //     this.folders.filter((f) => f.selected).map((f) => f.name),
  //   );
  // }

  handleConnectStorageAddon() {
    if (!this.addon() || !this.addonForm.valid) return;

    this.isConnecting.set(true);
    const request = this.#generateRequestPayload();

    this.#store
      .dispatch(
        !this.isAuthorized()
          ? new CreateAuthorizedAddon(request, this.addonTypeString())
          : new UpdateAuthorizedAddon(
              request,
              this.addonTypeString(),
              this.addon()!.id,
            ),
      )
      .subscribe({
        complete: () => {
          const createdAddon = this.createdAddon();
          if (createdAddon) {
            this.addonAuthUrl.set(createdAddon.attributes.auth_url);
            window.open(createdAddon.attributes.auth_url, '_blank');
            this.stepper()?.value.set(3);
          }
          this.isConnecting.set(false);
        },
        error: () => {
          this.isConnecting.set(false);
        },
      });
  }

  #initializeForm(): FormGroup<AddonForm> {
    const addon = this.addon();

    if (addon) {
      const formControls: Partial<AddonForm> = {
        [AddonFormControls.AccountName]: this.#fb.control<string>(
          addon.displayName || '',
          Validators.required,
        ),
      };

      switch (addon.credentialsFormat) {
        case CredentialsFormat.ACCESS_SECRET_KEYS:
          formControls[AddonFormControls.AccessKey] = this.#fb.control<string>(
            '',
            Validators.required,
          );
          formControls[AddonFormControls.SecretKey] = this.#fb.control<string>(
            '',
            Validators.required,
          );
          break;
        case CredentialsFormat.DATAVERSE_API_TOKEN:
          formControls[AddonFormControls.HostUrl] = this.#fb.control<string>(
            '',
            Validators.required,
          );
          formControls[AddonFormControls.PersonalAccessToken] =
            this.#fb.control<string>('', Validators.required);
          break;
        case CredentialsFormat.USERNAME_PASSWORD:
          formControls[AddonFormControls.HostUrl] = this.#fb.control<string>(
            '',
            Validators.required,
          );
          formControls[AddonFormControls.Username] = this.#fb.control<string>(
            '',
            Validators.required,
          );
          formControls[AddonFormControls.Password] = this.#fb.control<string>(
            '',
            Validators.required,
          );
          break;
        case CredentialsFormat.REPO_TOKEN:
          formControls[AddonFormControls.AccessKey] = this.#fb.control<string>(
            '',
            Validators.required,
          );
          formControls[AddonFormControls.SecretKey] = this.#fb.control<string>(
            '',
            Validators.required,
          );
          break;
      }
      return this.#fb.group(formControls as AddonForm);
    }

    return new FormGroup({} as AddonForm);
  }

  #generateRequestPayload(): AddonRequest {
    const formValue = this.addonForm.value;
    const addon = this.addon()!;
    const credentials: Record<string, unknown> = {};
    const initiateOAuth =
      addon.credentialsFormat === CredentialsFormat.OAUTH2 ||
      addon.credentialsFormat === CredentialsFormat.OAUTH;

    switch (addon.credentialsFormat) {
      case CredentialsFormat.ACCESS_SECRET_KEYS:
        credentials['access_key'] = formValue[AddonFormControls.AccessKey];
        credentials['secret_key'] = formValue[AddonFormControls.SecretKey];
        break;
      case CredentialsFormat.DATAVERSE_API_TOKEN:
        credentials['personal_access_token'] =
          formValue[AddonFormControls.PersonalAccessToken];
        break;
      case CredentialsFormat.USERNAME_PASSWORD:
        credentials['username'] = formValue[AddonFormControls.Username];
        credentials['password'] = formValue[AddonFormControls.Password];
        break;
      case CredentialsFormat.REPO_TOKEN:
        credentials['access_key'] = formValue[AddonFormControls.AccessKey];
        credentials['secret_key'] = formValue[AddonFormControls.SecretKey];
        break;
    }

    const requestPayload: AddonRequest = {
      data: {
        id: addon.id || '',
        attributes: {
          api_base_url: formValue[AddonFormControls.HostUrl] || '',
          display_name: formValue[AddonFormControls.AccountName] || '',
          authorized_capabilities: ['ACCESS', 'UPDATE'],
          credentials,
          initiate_oauth: initiateOAuth,
          auth_url: null,
          credentials_available: false,
        },
        relationships: {
          account_owner: {
            data: {
              type: 'user-references',
              id: this.userReference()[0].id || '',
            },
          },
          ...this.#getServiceRelationship(addon),
        },
        type: `authorized-${this.addonTypeString()}-accounts`,
      },
    };

    return requestPayload;
  }

  #getServiceRelationship(addon: Addon | AuthorizedAddon) {
    return {
      [`external_${this.addonTypeString()}_service`]: {
        data: {
          type: `external-${this.addonTypeString()}-services`,
          id: this.isAuthorized()
            ? (addon as AuthorizedAddon).externalStorageServiceId
            : (addon as Addon).id, //check if addon is already authorized and set relationship ID accordingly
        },
      },
    };
  }

  #getTerms(): AddonTerm[] {
    const addon = this.#router.getCurrentNavigation()?.extras.state?.[
      'addon'
    ] as Addon | AuthorizedAddon;
    if (!addon) {
      this.#router.navigate(['/settings/addons']);
    }

    this.addon.set(addon);
    const supportedFeatures = addon.supportedFeatures;
    const provider = addon.providerName;
    const isCitationService = addon.type === 'external-citation-services';

    const relevantTerms = isCitationService
      ? addonTerms.filter((term) => term.citation)
      : addonTerms;

    return relevantTerms.map((term) => {
      const feature = term.supportedFeature;
      const hasFeature = supportedFeatures.includes(feature);
      const hasPartialFeature = supportedFeatures.includes(
        `${feature}_PARTIAL`,
      );

      let message: string;
      let type: 'warning' | 'info' | 'danger';

      if (isCitationService && term.citation) {
        if (hasPartialFeature && term.citation.partial) {
          message = term.citation.partial;
          type = 'warning';
        } else if (!hasFeature && term.citation.false) {
          message = term.citation.false;
          type = 'danger';
        } else {
          message = term.storage[hasFeature ? 'true' : 'false'];
          type = hasFeature ? 'info' : 'danger';
        }
      } else {
        message = term.storage[hasFeature ? 'true' : 'false'];
        type = hasFeature ? 'info' : hasPartialFeature ? 'warning' : 'danger';
      }

      return {
        function: term.label,
        status: message.replace(/{provider}/g, provider),
        type,
      };
    });
  }
}
