import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PreprintsHelpDialogComponent } from '@osf/features/preprints/components';
import { RegistryProviderDetails } from '@osf/features/registries/models/registry-provider.model';
import { SearchInputComponent } from '@shared/components';
import { DecodeHtmlPipe } from '@shared/pipes';
import { BrandService } from '@shared/services';
import { HeaderStyleHelper } from '@shared/utils';

@Component({
  selector: 'osf-registry-provider-hero',
  imports: [DecodeHtmlPipe, SearchInputComponent, Skeleton, TitleCasePipe, TranslatePipe],
  templateUrl: './registry-provider-hero.component.html',
  styleUrl: './registry-provider-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryProviderHeroComponent {
  protected translateService = inject(TranslateService);
  protected dialogService = inject(DialogService);

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
        // this.actions.setProviderIri(provider.iri);

        // if (!this.initAfterIniReceived) {
        //   this.initAfterIniReceived = true;
        //   this.actions.getResources();
        //   this.actions.getAllOptions();
        // }

        BrandService.applyBranding(provider.brand);
        HeaderStyleHelper.applyHeaderStyles(
          provider.brand.primaryColor,
          provider.brand.secondaryColor,
          provider.brand.heroBackgroundImageUrl
        );
      }
    });
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
}
