import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { RightControl } from '../../models';
import { ProjectDetailSettingAccordionComponent } from '../project-detail-setting-accordion/project-detail-setting-accordion.component';

@Component({
  selector: 'osf-settings-wiki-card',
  imports: [Card, Checkbox, TranslatePipe, ProjectDetailSettingAccordionComponent],
  templateUrl: './settings-wiki-card.component.html',
  styleUrl: '../../settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsWikiCardComponent {
  formControl = input.required<FormControl>();
  rightControls = input.required<RightControl[]>();
  accessOptions = input.required<{ label: string; value: string }[]>();
  accessChange = output<string>();
}
