import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';

import { SearchInputComponent } from '@shared/components';

import { CollectionsHelpDialogComponent, CollectionsMainContentComponent } from './components';

@Component({
  selector: 'osf-collections',
  imports: [NgOptimizedImage, SearchInputComponent, TranslatePipe, Button, CollectionsMainContentComponent],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsComponent {
  protected dialogService = inject(DialogService);
  protected translateService = inject(TranslateService);
  protected searchControl = new FormControl('');

  openHelpDialog() {
    this.dialogService.open(CollectionsHelpDialogComponent, {
      focusOnShow: false,
      header: this.translateService.instant('collections.helpDialog.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
