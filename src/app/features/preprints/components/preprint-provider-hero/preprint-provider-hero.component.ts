import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { CustomDialogService } from '@osf/shared/services';
import { SearchInputComponent } from '@shared/components';
import { DecodeHtmlPipe } from '@shared/pipes';

import { PreprintsHelpDialogComponent } from '../preprints-help-dialog/preprints-help-dialog.component';

@Component({
  selector: 'osf-preprint-provider-hero',
  imports: [Button, RouterLink, SearchInputComponent, Skeleton, TranslatePipe, DecodeHtmlPipe, TitleCasePipe],
  templateUrl: './preprint-provider-hero.component.html',
  styleUrl: './preprint-provider-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintProviderHeroComponent {
  customDialogService = inject(CustomDialogService);

  searchControl = input<FormControl>(new FormControl());
  preprintProvider = input.required<PreprintProviderDetails | undefined>();
  isPreprintProviderLoading = input.required<boolean>();
  triggerSearch = output<string>();

  onTriggerSearch(value: string) {
    this.triggerSearch.emit(value);
  }

  openHelpDialog() {
    this.customDialogService.open(PreprintsHelpDialogComponent, { header: 'preprints.helpDialog.header' });
  }
}
