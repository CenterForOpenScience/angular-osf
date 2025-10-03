import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { debounceTime } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ClearCurrentProvider } from '@core/store/provider';
import { LoadingSpinnerComponent, SearchInputComponent } from '@osf/shared/components';
import { HeaderStyleHelper } from '@osf/shared/helpers';
import { CollectionsFilters } from '@osf/shared/models';
import { BrandService, CustomDialogService } from '@osf/shared/services';
import {
  ClearCollections,
  ClearCollectionSubmissions,
  CollectionsSelectors,
  GetCollectionDetails,
  GetCollectionProvider,
  SearchCollectionSubmissions,
  SetPageNumber,
  SetSearchValue,
} from '@osf/shared/stores';

import { CollectionsQuerySyncService } from '../../services';
import { CollectionsHelpDialogComponent } from '../collections-help-dialog/collections-help-dialog.component';
import { CollectionsMainContentComponent } from '../collections-main-content';

@Component({
  selector: 'osf-collections-discover',
  imports: [
    SearchInputComponent,
    TranslatePipe,
    Button,
    CollectionsMainContentComponent,
    LoadingSpinnerComponent,
    RouterLink,
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

  searchControl = new FormControl('');
  providerId = signal<string>('');

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
    clearCurrentProvider: ClearCurrentProvider,
  });

  constructor() {
    this.initializeProvider();
    this.setupEffects();
    this.setupSearchBinding();
  }

  openHelpDialog(): void {
    this.customDialogService.open(CollectionsHelpDialogComponent, { header: 'collections.helpDialog.header' });
  }

  onSearchTriggered(searchValue: string): void {
    this.actions.setSearchValue(searchValue);
    this.actions.setPageNumber('1');
  }

  private initializeProvider(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.providerId.set(id);
    this.actions.getCollectionProvider(id);
  }

  private setupEffects(): void {
    this.querySyncService.initializeFromUrl();

    effect(() => {
      const collectionId = this.primaryCollectionId();
      if (collectionId) {
        this.actions.getCollectionDetails(collectionId);
      }
    });

    effect(() => {
      const provider = this.collectionProvider();

      if (provider && provider.brand) {
        BrandService.applyBranding(provider.brand);
        HeaderStyleHelper.applyHeaderStyles(provider.brand.secondaryColor, provider.brand.backgroundColor || '');
      }
    });

    effect(() => {
      const searchText = this.searchText();
      const sortBy = this.sortBy();
      const selectedFilters = this.selectedFilters();
      const pageNumber = this.pageNumber();

      if (searchText !== undefined && sortBy !== undefined && selectedFilters && pageNumber) {
        this.querySyncService.syncStoreToUrl(searchText, sortBy, selectedFilters, pageNumber);
      }
    });

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

    this.destroyRef.onDestroy(() => {
      this.actions.clearCollections();
      HeaderStyleHelper.resetToDefaults();
      BrandService.resetBranding();
    });
  }

  private getActiveFilters(filters: CollectionsFilters): Record<string, string[]> {
    return Object.entries(filters)
      .filter(([_, value]) => value.length)
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
