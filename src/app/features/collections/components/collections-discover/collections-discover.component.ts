import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { debounceTime } from 'rxjs';

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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { CedarTemplateFilterMapper } from '@osf/shared/mappers/filters/cedar-template-filter.mapper';
import { CollectionsFilters } from '@osf/shared/models/collections/collections-filters.model';
import { BrandService } from '@osf/shared/services/brand.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { HeaderStyleService } from '@osf/shared/services/header-style.service';
import {
  ClearCollections,
  ClearCollectionSubmissions,
  CollectionsSelectors,
  GetCollectionDetails,
  GetCollectionProvider,
  SearchCollectionSubmissions,
  SetPageNumber,
  SetSearchValue,
} from '@osf/shared/stores/collections';
import { ResetSearchState, SetDefaultFilterValue, SetExtraFilters } from '@osf/shared/stores/global-search';

import { CollectionsQuerySyncService } from '../../services';
import { CollectionsHelpDialogComponent } from '../collections-help-dialog/collections-help-dialog.component';
import { CollectionsMainContentComponent } from '../collections-main-content/collections-main-content.component';

@Component({
  selector: 'osf-collections-discover',
  imports: [
    Button,
    RouterLink,
    SearchInputComponent,
    CollectionsMainContentComponent,
    GlobalSearchComponent,
    LoadingSpinnerComponent,
    TranslatePipe,
  ],
  templateUrl: './collections-discover.component.html',
  styleUrl: './collections-discover.component.scss',
  providers: [CollectionsQuerySyncService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsDiscoverComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private customDialogService = inject(CustomDialogService);
  private querySyncService = inject(CollectionsQuerySyncService);
  private destroyRef = inject(DestroyRef);
  private brandService = inject(BrandService);
  private headerStyleHelper = inject(HeaderStyleService);
  private platformId = inject(PLATFORM_ID);
  private environment = inject(ENVIRONMENT);
  private isBrowser = isPlatformBrowser(this.platformId);

  searchControl = new FormControl('');
  providerId = signal<string>('');
  defaultSearchFiltersInitialized = signal(false);

  readonly useShtrovSearch: boolean = this.environment.collectionSubmissionWithCedar;

  collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  collectionDetails = select(CollectionsSelectors.getCollectionDetails);
  selectedFilters = select(CollectionsSelectors.getAllSelectedFilters);
  sortBy = select(CollectionsSelectors.getSortBy);
  searchText = select(CollectionsSelectors.getSearchText);
  pageNumber = select(CollectionsSelectors.getPageNumber);
  isProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);

  primaryCollectionId = computed(() => this.collectionProvider()?.primaryCollection?.id);

  actions = createDispatchMap({
    getCollectionProvider: GetCollectionProvider,
    getCollectionDetails: GetCollectionDetails,
    setSearchValue: SetSearchValue,
    searchCollectionSubmissions: SearchCollectionSubmissions,
    setPageNumber: SetPageNumber,
    clearCollections: ClearCollections,
    clearCollectionsSubmissions: ClearCollectionSubmissions,
    setDefaultFilterValue: SetDefaultFilterValue,
    setExtraFilters: SetExtraFilters,
    resetSearchState: ResetSearchState,
  });

  constructor() {
    this.initializeProvider();
    this.setupBrandingEffect();

    if (this.useShtrovSearch) {
      this.setupShtrovSearchEffect();
    } else {
      this.setupCollectionDetailsEffect();
      this.setupUrlSyncEffect();
      this.setupLegacySearchEffect();
      this.setupSearchBinding();
    }

    this.destroyRef.onDestroy(() => {
      if (this.isBrowser) {
        this.actions.clearCollections();
        if (this.useShtrovSearch) {
          this.actions.resetSearchState();
        }
        this.headerStyleHelper.resetToDefaults();
        this.brandService.resetBranding();
      }
    });
  }

  openHelpDialog(): void {
    this.customDialogService.open(CollectionsHelpDialogComponent, { header: 'collections.helpDialog.header' });
  }

  onSearchTriggered(searchValue: string): void {
    if (!this.useShtrovSearch) {
      this.actions.setSearchValue(searchValue);
      this.actions.setPageNumber('1');
    }
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

  private setupShtrovSearchEffect(): void {
    effect(() => {
      const provider = this.collectionProvider();
      const collectionId = this.primaryCollectionId();

      if (!provider || !collectionId || this.defaultSearchFiltersInitialized()) return;

      const collectionIri = `${this.environment.apiDomainUrl}/v2/collections/${collectionId}/`;
      // TODO(ENG-9818): verify 'isContainedBy' property path against shtrove API before shipping
      this.actions.setDefaultFilterValue('isContainedBy', collectionIri);

      if (provider.requiredMetadataTemplate?.attributes?.template) {
        const extraFilters = CedarTemplateFilterMapper.fromTemplate(
          provider.requiredMetadataTemplate.attributes.template
        );
        this.actions.setExtraFilters(extraFilters);
      }

      this.defaultSearchFiltersInitialized.set(true);
    });
  }

  private setupCollectionDetailsEffect(): void {
    effect(() => {
      const collectionId = this.primaryCollectionId();
      if (collectionId) {
        this.actions.getCollectionDetails(collectionId);
      }
    });
  }

  private setupUrlSyncEffect(): void {
    this.querySyncService.initializeFromUrl();

    effect(() => {
      const searchText = this.searchText();
      const sortBy = this.sortBy();
      const selectedFilters = this.selectedFilters();
      const pageNumber = this.pageNumber();

      if (searchText !== undefined && sortBy !== undefined && selectedFilters && pageNumber) {
        this.querySyncService.syncStoreToUrl(searchText, sortBy, selectedFilters, pageNumber);
      }
    });
  }

  private setupLegacySearchEffect(): void {
    effect(() => {
      const searchText = this.searchText();
      const sortBy = this.sortBy();
      const selectedFilters = this.selectedFilters();
      const pageNumber = this.pageNumber();
      const providerId = this.providerId();
      const collectionDetails = this.collectionDetails();

      if (searchText !== undefined && selectedFilters && pageNumber && providerId && collectionDetails) {
        const activeFilters = this.getActiveFilters(selectedFilters);
        this.actions.clearCollectionsSubmissions();
        this.actions.searchCollectionSubmissions(providerId, searchText, activeFilters, pageNumber, sortBy);
      }
    });
  }

  private getActiveFilters(filters: CollectionsFilters): Record<string, string[]> {
    return Object.entries(filters)
      .filter(([, value]) => value.length)
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string[]>
      );
  }

  private setupSearchBinding(): void {
    effect(() => {
      const storeSearchText = this.searchText();
      const currentControlValue = this.searchControl.value;

      if (storeSearchText !== currentControlValue) {
        this.searchControl.setValue(storeSearchText, { emitEvent: false });
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchValue) => {
        const trimmedValue = searchValue?.trim() || '';
        if (trimmedValue !== this.searchText()) {
          this.actions.setSearchValue(trimmedValue);
        }
      });
  }
}
