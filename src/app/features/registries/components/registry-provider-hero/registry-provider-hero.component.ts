import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { PreprintsHelpDialogComponent } from '@osf/features/preprints/components';
import { RegistryProviderDetails } from '@osf/features/registries/models/registry-provider.model';
import { HeaderStyleHelper } from '@osf/shared/helpers';
import { SearchInputComponent } from '@shared/components';
import { DecodeHtmlPipe } from '@shared/pipes';
import { BrandService } from '@shared/services';

@Component({
  selector: 'osf-registry-provider-hero',
  imports: [DecodeHtmlPipe, SearchInputComponent, Skeleton, TitleCasePipe, TranslatePipe, Button],
  templateUrl: './registry-provider-hero.component.html',
  styleUrl: './registry-provider-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryProviderHeroComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  private readonly dialogService = inject(DialogService);

  private readonly WHITE = '#ffffff';
  searchControl = input<FormControl>(new FormControl());
  provider = input.required<RegistryProviderDetails | null>();
  isProviderLoading = input.required<boolean>();
  triggerSearch = output<string>();

  onTriggerSearch(value: string) {
    this.triggerSearch.emit(value);
  }

  constructor() {
    effect(() => {
      const provider = this.provider();

      if (provider) {
        BrandService.applyBranding(provider.brand);
        HeaderStyleHelper.applyHeaderStyles(
          this.WHITE,
          provider.brand.primaryColor,
          provider.brand.heroBackgroundImageUrl
        );
      }
    });
  }

  ngOnDestroy() {
    HeaderStyleHelper.resetToDefaults();
    BrandService.resetBranding();
  }

  openHelpDialog() {
    this.dialogService.open(PreprintsHelpDialogComponent, {
      focusOnShow: false,
      header: this.translateService.instant('preprints.helpDialog.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  navigateToCreatePage() {
    const providerId = this.provider()?.id;

    if (!providerId) {
      return;
    }

    this.router.navigate([`/registries/${providerId}/new`]);
  }
}
