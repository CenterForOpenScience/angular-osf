import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ProjectDetailSettingAccordionComponent } from '@osf/features/project/settings/components';
import { RightControl } from '@osf/features/project/settings/models/right-control.model';

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
