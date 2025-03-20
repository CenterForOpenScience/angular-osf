import { Component, signal } from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Card } from 'primeng/card';
import { RadioButton } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { GoogleDriveFolder } from '@shared/entities/google-drive-folder.interface';
import { AddonTerm } from '@shared/entities/addon-terms.interface';
import { Divider } from 'primeng/divider';

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
  protected readonly terms: AddonTerm[] = [
    {
      function: 'Add / Update Files',
      status: 'You cannot add or update files for figshare within OSF.',
      type: 'warning',
    },
    {
      function: 'Delete files',
      status: 'You cannot delete files for figshare within OSF.',
      type: 'warning',
    },
    {
      function: 'Forking',
      status:
        'Only the user who first authorized the figshare add-on within source project can transfer its authorization to a forked project or component.',
      type: 'info',
    },
    {
      function: 'Logs',
      status:
        'OSF tracks changes you make to your figshare content within OSF, but not changes made directly within figshare.',
      type: 'info',
    },
    {
      function: 'Permissions',
      status:
        'The OSF does not change permissions for linked figshare files. Privacy changes made to an OSF project or component will not affect those set in figshare.',
      type: 'info',
    },
    {
      function: 'Registering',
      status:
        'figshare content will be registered, but version history will not be copied to the registration.',
      type: 'info',
    },
    {
      function: 'View/Download File Versions',
      status:
        'figshare files can be viewed/downloaded in OSF, but version history is not supported.',
      type: 'warning',
    },
  ];

  toggleFolderSelection(folder: GoogleDriveFolder): void {
    folder.selected = !folder.selected;
    this.selectedFolders.set(
      this.folders.filter((f) => f.selected).map((f) => f.name),
    );
  }
}
