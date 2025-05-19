import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { TabPanels } from 'primeng/tabs';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AccordionTableComponent } from '@osf/features/project/settings/components';
import { LinkTableModel } from '@osf/features/project/settings/models';
import { ShareIndexingEnum } from '@osf/features/settings/account-settings/components/share-indexing/enums/share-indexing.enum';
import { ViewOnlyTableComponent } from '@osf/shared';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { ProjectForm } from '@shared/entities/create-project-form.interface';
import { ProjectFormControls } from '@shared/entities/create-project-form-controls.enum';
import { IS_WEB } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-settings',
  imports: [
    TranslatePipe,
    SubHeaderComponent,
    TabPanels,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    Textarea,
    Card,
    Button,
    ViewOnlyTableComponent,
    Checkbox,
    AccordionTableComponent,
    RadioButton,
    RouterLink,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  protected readonly isDesktop = toSignal(inject(IS_WEB));

  protected readonly ProjectFormControls = ProjectFormControls;
  protected commenting = signal<ShareIndexingEnum>(ShareIndexingEnum.None);

  projectForm = new FormGroup<Partial<ProjectForm>>({
    [ProjectFormControls.Title]: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    [ProjectFormControls.Description]: new FormControl('', {
      nonNullable: true,
    }),
  });
  accessRequest = new FormControl<boolean>(false);
  wiki = new FormControl<boolean>(false);
  redirectLink = new FormControl<boolean>(false);

  tableData: LinkTableModel[] = [
    {
      linkName: 'name',
      sharedComponents: 'Project name',
      createdDate: new Date(),
      createdBy: 'Igor',
      anonymous: false,
      link: 'www.facebook.com',
    },
    {
      linkName: 'name',
      sharedComponents: 'Project name',
      createdDate: new Date(),
      createdBy: 'Igor',
      anonymous: false,
      link: 'www.facebook.com',
    },
    {
      linkName: 'name',
      sharedComponents: 'Project name',
      createdDate: new Date(),
      createdBy: 'Igor',
      anonymous: false,
      link: 'www.facebook.com',
    },
    {
      linkName: 'name',
      sharedComponents: 'Project name',
      createdDate: new Date(),
      createdBy: 'Igor',
      anonymous: false,
      link: 'www.facebook.com',
    },
  ];
  access = 'write';
  accessOptions = [
    { label: 'Contributors (with write access)', value: 'write' },
    { label: 'Anyone with link', value: 'public' },
  ];
  commentSetting = 'instantly';
  fileSetting = 'instantly';

  dropdownOptions = [
    { label: 'Instantly', value: 'instantly' },
    { label: 'Daily', value: 'daily' },
    { label: 'Never', value: 'never' },
  ];
  submitForm(): void {
    // TODO: implement form submission
  }

  resetForm(): void {
    this.projectForm.reset();
  }

  onAccessChange(value: string): void {
    console.log('Access changed to', value);
  }
}
