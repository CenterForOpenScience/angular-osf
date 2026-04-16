import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { SafeHtmlPipe } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { normalizeQuotes } from '@shared/helpers/normalize-quotes';

import { PreprintsHelpDialogComponent } from '../preprints-help-dialog/preprints-help-dialog.component';

@Component({
  selector: 'osf-preprint-provider-hero',
  imports: [Button, Skeleton, RouterLink, SearchInputComponent, SafeHtmlPipe, TitleCasePipe, TranslatePipe],
  templateUrl: './preprint-provider-hero.component.html',
  styleUrl: './preprint-provider-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintProviderHeroComponent {
  private readonly customDialogService = inject(CustomDialogService);

  readonly searchControl = input<FormControl<string>>(new FormControl('', { nonNullable: true }));
  readonly isPreprintProviderLoading = input.required<boolean>();
  readonly preprintProvider = input<PreprintProviderDetails>();
  readonly triggerSearch = output<string>();

  onTriggerSearch(value: string): void {
    this.triggerSearch.emit(normalizeQuotes(value) ?? '');
  }

  openHelpDialog(): void {
    this.customDialogService.open(PreprintsHelpDialogComponent, {
      header: 'preprints.helpDialog.header',
      width: '560px',
    });
  }
}
