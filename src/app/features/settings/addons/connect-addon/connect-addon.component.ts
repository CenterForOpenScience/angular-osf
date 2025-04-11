import { Component, signal } from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterLink, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Card } from 'primeng/card';
import { RadioButton } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { GoogleDriveFolder } from '@shared/entities/google-drive-folder.interface';
import { AddonTerm } from '@osf/features/settings/addons/entities/addon-terms.interface';
import { Divider } from 'primeng/divider';
import { ADDON_TERMS_MESSAGES } from '../utils/addon-terms.const';
import {
  Addon,
  AuthorizedAddon,
} from '@osf/features/settings/addons/entities/addons.entities';

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
    RadioButton,
    Checkbox,
    Divider,
  ],
  templateUrl: './connect-addon.component.html',
  styleUrl: './connect-addon.component.scss',
  standalone: true,
})
export class ConnectAddonComponent {
  protected radioConfig = '';
  protected readonly selectedFolders = signal<string[]>([]);
  protected readonly folders: GoogleDriveFolder[] = [
    { name: 'folder name example', selected: false },
    { name: 'folder name example', selected: false },
    { name: 'folder name example', selected: false },
    { name: 'folder name example', selected: false },
    { name: 'folder name example', selected: false },
    { name: 'folder name example', selected: false },
  ];
  protected readonly terms = signal<AddonTerm[]>([]);

  constructor(private router: Router) {
    const addon = this.router.getCurrentNavigation()?.extras.state?.[
      'addon'
    ] as Addon | AuthorizedAddon;
    if (!addon) return;

    const supportedFeatures =
      'supportedFeatures' in addon ? addon.supportedFeatures : [];
    const provider =
      addon.displayName || addon.externalServiceName || 'provider';

    const terms: AddonTerm[] = [
      {
        function: ADDON_TERMS_MESSAGES.labels['add-update-files'],
        status: this.getTermMessage(
          'add-update-files',
          supportedFeatures,
          provider,
        ),
        type: this.getTermType('add-update-files', supportedFeatures),
      },
      {
        function: ADDON_TERMS_MESSAGES.labels['delete-files'],
        status: this.getTermMessage(
          'delete-files',
          supportedFeatures,
          provider,
        ),
        type: this.getTermType('delete-files', supportedFeatures),
      },
      {
        function: ADDON_TERMS_MESSAGES.labels['forking'],
        status: this.getTermMessage('forking', supportedFeatures, provider),
        type: this.getTermType('forking', supportedFeatures),
      },
      {
        function: ADDON_TERMS_MESSAGES.labels['logs'],
        status: this.getTermMessage('logs', supportedFeatures, provider),
        type: this.getTermType('logs', supportedFeatures),
      },
      {
        function: ADDON_TERMS_MESSAGES.labels['permissions'],
        status: this.getTermMessage('permissions', supportedFeatures, provider),
        type: this.getTermType('permissions', supportedFeatures),
      },
      {
        function: ADDON_TERMS_MESSAGES.labels['registering'],
        status: this.getTermMessage('registering', supportedFeatures, provider),
        type: this.getTermType('registering', supportedFeatures),
      },
      {
        function: ADDON_TERMS_MESSAGES.labels['file-versions'],
        status: this.getTermMessage(
          'file-versions',
          supportedFeatures,
          provider,
        ),
        type: this.getTermType('file-versions', supportedFeatures),
      },
    ];

    this.terms.set(terms);
  }

  private getTermMessage(
    term: string,
    supportedFeatures: string[],
    provider: string,
  ): string {
    const feature = term.toUpperCase().replace(/-/g, '_');
    const hasFeature = supportedFeatures.includes(feature);

    const messageKey = `${term}-${hasFeature ? 'true' : 'false'}`;
    const message =
      ADDON_TERMS_MESSAGES.storage[
        messageKey as keyof typeof ADDON_TERMS_MESSAGES.storage
      ];

    return message ? message.replace(/{provider}/g, provider) : '';
  }

  private getTermType(
    term: string,
    supportedFeatures: string[],
  ): 'warning' | 'info' {
    const feature = term.toUpperCase().replace(/-/g, '_');
    return supportedFeatures.includes(feature) ? 'info' : 'warning';
  }

  toggleFolderSelection(folder: GoogleDriveFolder): void {
    folder.selected = !folder.selected;
    this.selectedFolders.set(
      this.folders.filter((f) => f.selected).map((f) => f.name),
    );
  }
}
