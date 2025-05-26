import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { TabPanels } from 'primeng/tabs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components';
import { ProjectFormControls, ShareIndexingEnum } from '@osf/shared/enums';
import { ProjectForm } from '@osf/shared/models';
import { IS_WEB } from '@osf/shared/utils';

import {
  ProjectDetailSettingAccordionComponent,
  SettingsAccessRequestsCardComponent,
  SettingsCommentingCardComponent,
  SettingsProjectFormCardComponent,
  SettingsStorageLocationCardComponent,
  SettingsViewOnlyLinksCardComponent,
  SettingsWikiCardComponent,
} from './components';
import { mockSettingsData } from './mock-data';
import { LinkTableModel, RightControl } from './models';

@Component({
  selector: 'osf-settings',
  imports: [
    TranslatePipe,
    SubHeaderComponent,
    TabPanels,
    FormsModule,
    ReactiveFormsModule,
    Card,
    Button,
    Checkbox,
    ProjectDetailSettingAccordionComponent,
    RouterLink,
    NgOptimizedImage,
    SettingsProjectFormCardComponent,
    SettingsStorageLocationCardComponent,
    SettingsViewOnlyLinksCardComponent,
    SettingsAccessRequestsCardComponent,
    SettingsWikiCardComponent,
    SettingsCommentingCardComponent,
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
  accessRequest = new FormControl(false);
  wiki = new FormControl(false);
  redirectLink = new FormControl<boolean>(false);

  tableData: LinkTableModel[];
  access: string;
  accessOptions: { label: string; value: string }[];
  commentSetting: string;
  fileSetting: string;
  dropdownOptions: { label: string; value: string }[];
  affiliations: { name: string; canDelete: boolean }[];
  rightControls: { wiki: RightControl[]; notifications: RightControl[] };

  constructor() {
    [
      this.tableData,
      this.access,
      this.accessOptions,
      this.commentSetting,
      this.fileSetting,
      this.dropdownOptions,
      this.affiliations,
      this.rightControls,
    ] = [
      mockSettingsData.tableData,
      mockSettingsData.access,
      mockSettingsData.accessOptions,
      mockSettingsData.commentSetting,
      mockSettingsData.fileSetting,
      mockSettingsData.dropdownOptions,
      mockSettingsData.affiliations,
      mockSettingsData.rightControls as { wiki: RightControl[]; notifications: RightControl[] },
    ];
  }

  submitForm(): void {
    // [VY] TODO: Implement form submission
  }

  resetForm(): void {
    this.projectForm.reset();
  }

  onAccessChange(event: string): void {
    console.log(event);
  }
}
