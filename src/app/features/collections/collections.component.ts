import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CollectionsMainContentComponent } from '@osf/features/collections/components/collections-main-content/collections-main-content.component';
import { SearchInputComponent } from '@shared/components';

@Component({
  selector: 'osf-collections',
  imports: [NgOptimizedImage, SearchInputComponent, TranslatePipe, Button, CollectionsMainContentComponent],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsComponent {
  protected searchValue = signal('');
  protected searchControl = new FormControl('');
}
