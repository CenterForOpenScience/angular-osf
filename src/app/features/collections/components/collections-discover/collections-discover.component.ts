import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { CedarTemplateFilterMapper } from '@osf/shared/mappers/filters/cedar-template-filter.mapper';
import { BrandService } from '@osf/shared/services/brand.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { HeaderStyleService } from '@osf/shared/services/header-style.service';
import { ClearCollections, CollectionsSelectors, GetCollectionProvider } from '@osf/shared/stores/collections';
import { ResetSearchState, SetDefaultFilterValue, SetExtraFilters } from '@osf/shared/stores/global-search';

import { CollectionsHelpDialogComponent } from '../collections-help-dialog/collections-help-dialog.component';

@Component({
  selector: 'osf-collections-discover',
  imports: [Button, RouterLink, SearchInputComponent, GlobalSearchComponent, LoadingSpinnerComponent, TranslatePipe],
  templateUrl: './collections-discover.component.html',
  styleUrl: './collections-discover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsDiscoverComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private customDialogService = inject(CustomDialogService);
  private destroyRef = inject(DestroyRef);
  private brandService = inject(BrandService);
  private headerStyleHelper = inject(HeaderStyleService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  searchControl = new FormControl('');
  providerId = signal<string>('');
  defaultSearchFiltersInitialized = signal(false);

  collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  isProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);

  primaryCollectionId = computed(() => this.collectionProvider()?.primaryCollection?.id);

  actions = createDispatchMap({
    getCollectionProvider: GetCollectionProvider,
    clearCollections: ClearCollections,
    setDefaultFilterValue: SetDefaultFilterValue,
    setExtraFilters: SetExtraFilters,
    resetSearchState: ResetSearchState,
  });

  constructor() {
    this.initializeProvider();
    this.setupBrandingEffect();
    this.setupShareTroveSearchEffect();

    this.destroyRef.onDestroy(() => {
      if (this.isBrowser) {
        this.actions.clearCollections();
        this.actions.resetSearchState();
        this.headerStyleHelper.resetToDefaults();
        this.brandService.resetBranding();
      }
    });
  }

  openHelpDialog(): void {
    this.customDialogService.open(CollectionsHelpDialogComponent, { header: 'collections.helpDialog.header' });
  }

  private initializeProvider(): void {
    const id = this.route.snapshot.paramMap.get('providerId');
    if (!id) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.providerId.set(id);
    this.actions.getCollectionProvider(id);
  }

  private setupBrandingEffect(): void {
    effect(() => {
      const provider = this.collectionProvider();

      if (provider?.brand) {
        this.brandService.applyBranding(provider.brand);
        this.headerStyleHelper.applyHeaderStyles(provider.brand.secondaryColor, provider.brand.backgroundColor || '');
      }
    });
  }

  private setupShareTroveSearchEffect(): void {
    effect(() => {
      const provider = this.collectionProvider();
      const collectionIri = provider?.iri;
      if (!provider || !collectionIri || this.defaultSearchFiltersInitialized()) return;

      this.actions.setDefaultFilterValue('isPartOfCollection', collectionIri);

      if (provider.requiredMetadataTemplate?.attributes?.template) {
        const extraFilters = CedarTemplateFilterMapper.fromTemplate(
          provider.requiredMetadataTemplate.attributes.template
        );
        this.actions.setExtraFilters(extraFilters);
      }

      this.defaultSearchFiltersInitialized.set(true);
    });
  }
}
