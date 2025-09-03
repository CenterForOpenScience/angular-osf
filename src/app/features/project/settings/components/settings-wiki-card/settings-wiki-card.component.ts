import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';

import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RightControl } from '../../models';
import { ProjectDetailSettingAccordionComponent } from '../project-detail-setting-accordion/project-detail-setting-accordion.component';

@Component({
  selector: 'osf-settings-wiki-card',
  imports: [Card, Checkbox, TranslatePipe, ProjectDetailSettingAccordionComponent, FormsModule],
  templateUrl: './settings-wiki-card.component.html',
  styleUrl: '../../settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsWikiCardComponent {
  anyoneCanEditWikiEmitValue = output<boolean>();
  wikiChangeEmit = output<boolean>();

  wikiEnabled = input.required<boolean>();
  anyoneCanEditWiki = input.required<boolean>();
  title = input.required<string>();
  isPublic = input(false);

  allAccordionData: RightControl[] = [];

  constructor() {
    effect(() => {
      const anyoneCanEditWiki = this.anyoneCanEditWiki();
      this.allAccordionData = [
        {
          label: 'myProjects.settings.whoCanEdit',
          value: anyoneCanEditWiki,
          type: 'dropdown',
          options: [
            { label: 'myProjects.settings.contributorsOption', value: false },
            { label: 'myProjects.settings.anyoneOption', value: true },
          ],
        },
      ];
    });
  }

  changeEmittedValue(emittedValue: { index: number; value: boolean | string }): void {
    if (typeof emittedValue.value === 'boolean') {
      this.anyoneCanEditWikiEmitValue.emit(emittedValue.value);
    }
  }
}
