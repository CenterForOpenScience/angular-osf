import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { debounceTime } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CollectionsHelpDialogComponent, CollectionsMainContentComponent } from '@osf/features/collections/components';
import { CollectionFilters } from '@osf/features/collections/models';
import { CollectionsQuerySyncService } from '@osf/features/collections/services';
import {
  CollectionsSelectors,
  GetCollectionDetails,
  GetCollectionProvider,
  GetCollectionSubmissions,
  SetPageNumber,
  SetSearchValue,
} from '@osf/features/collections/store';
import { LoadingSpinnerComponent, SearchInputComponent } from '@shared/components';

@Component({
  selector: 'osf-collections-discover',
  imports: [
    Button,
    CollectionsMainContentComponent,
    LoadingSpinnerComponent,
    SearchInputComponent,
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './collections-discover.component.html',
  styleUrl: './collections-discover.component.scss',
  providers: [DialogService, CollectionsQuerySyncService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsDiscoverComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  private querySyncService = inject(CollectionsQuerySyncService);
  private destroyRef = inject(DestroyRef);

  protected searchControl = new FormControl('');
  protected providerId = signal<string>('');

  protected collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  protected collectionDetails = select(CollectionsSelectors.getCollectionDetails);
  protected selectedFilters = select(CollectionsSelectors.getAllSelectedFilters);
  protected sortBy = select(CollectionsSelectors.getSortBy);
  protected searchText = select(CollectionsSelectors.getSearchText);
  protected pageNumber = select(CollectionsSelectors.getPageNumber);
  protected isProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  protected primaryCollectionId = computed(() => this.collectionProvider()?.primaryCollection?.id);

  protected actions = createDispatchMap({
    getCollectionProvider: GetCollectionProvider,
    getCollectionDetails: GetCollectionDetails,
    setSearchValue: SetSearchValue,
    getCollectionSubmissions: GetCollectionSubmissions,
    setPageNumber: SetPageNumber,
  });

  constructor() {
    this.initializeProvider();
    this.setupEffects();
    this.setupSearchBinding();
  }

  protected openHelpDialog(): void {
    this.dialogService.open(CollectionsHelpDialogComponent, {
      focusOnShow: false,
      header: this.translateService.instant('collections.helpDialog.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  protected onSearchTriggered(searchValue: string): void {
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
      const searchText = this.searchText();
      const sortBy = this.sortBy();
      const selectedFilters = this.selectedFilters();
      const pageNumber = this.pageNumber();

      if (searchText !== undefined && sortBy && selectedFilters && pageNumber) {
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

      if (searchText !== undefined && sortBy && selectedFilters && pageNumber && providerId && collectionDetails) {
        const activeFilters = this.getActiveFilters(selectedFilters);
        this.actions.getCollectionSubmissions(providerId, searchText, activeFilters, pageNumber, sortBy);
      }
    });
  }

  private getActiveFilters(filters: CollectionFilters): Record<string, string[]> {
    return Object.entries(filters)
      .filter(([key, value]) => value.length)
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
