import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { PreprintsHelpDialogComponent } from '@osf/features/preprints/components';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { HeaderStyleHelper } from '@osf/shared/helpers/header-style.helper';
import { BrandService } from '@osf/shared/services/brand.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { RegistryProviderDetails } from '@shared/models/provider/registry-provider.model';
import { DecodeHtmlPipe } from '@shared/pipes/decode-html.pipe';

@Component({
  selector: 'osf-registry-provider-hero',
  imports: [DecodeHtmlPipe, SearchInputComponent, Skeleton, TitleCasePipe, TranslatePipe, Button],
  templateUrl: './registry-provider-hero.component.html',
  styleUrl: './registry-provider-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryProviderHeroComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly customDialogService = inject(CustomDialogService);

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

      if (provider?.brand) {
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
    this.customDialogService.open(PreprintsHelpDialogComponent, { header: 'preprints.helpDialog.header' });
  }

  navigateToCreatePage() {
    const providerId = this.provider()?.id;

    if (!providerId) {
      return;
    }

    this.router.navigate([`/registries/${providerId}/new`]);
  }
}
