import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TagsInputComponent } from '@osf/shared/components';

@Component({
  selector: 'osf-registries-tags',
  imports: [Card, TagsInputComponent, TranslatePipe],
  templateUrl: './registries-tags.component.html',
  styleUrl: './registries-tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesTagsComponent {
  onTagsChanged(tags: string[]): void {
    console.log('Tags changed:', tags);
  }
}
