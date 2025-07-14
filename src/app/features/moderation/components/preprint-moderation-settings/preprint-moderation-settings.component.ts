import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { RadioButton } from 'primeng/radiobutton';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { PREPRINT_SETTINGS_SECTIONS } from '../../constants';
import { CommentVisibilityType, ModerationType, ModeratorsCommentsType, SettingsSectionControl } from '../../enums';

@Component({
  selector: 'osf-preprint-moderation-settings',
  imports: [TranslatePipe, ReactiveFormsModule, Card, RadioButton, Message],
  templateUrl: './preprint-moderation-settings.component.html',
  styleUrl: './preprint-moderation-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintModerationSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  settingsForm!: FormGroup;
  sections = PREPRINT_SETTINGS_SECTIONS;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.settingsForm = this.fb.group({
      [SettingsSectionControl.ModerationType]: [ModerationType.Pre],
      [SettingsSectionControl.CommentVisibility]: [CommentVisibilityType.Moderators],
      [SettingsSectionControl.ModeratorComments]: [ModeratorsCommentsType.Anonymized],
    });

    this.settingsForm.disable();
  }
}
