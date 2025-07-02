import { createDispatchMap, select } from '@ngxs/store';

import { debounceTime, map, of, skip, take } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PreprintsResourcesComponent } from '@osf/features/preprints/components';
import { PreprintProviderHeroComponent } from '@osf/features/preprints/components/preprint-provider-hero/preprint-provider-hero.component';
import { GetPreprintProviderById, PreprintsSelectors } from '@osf/features/preprints/store/preprints';
import {
  GetResources,
  ResetState,
  SetProviderIri,
  SetSearchText,
  SetSortBy,
} from '@osf/features/preprints/store/preprints-discover';
import { PreprintsDiscoverSelectors } from '@osf/features/preprints/store/preprints-discover/preprints-discover.selectors';
import {
  PreprintsResourcesFiltersSelectors,
  ResetFiltersState,
  SetCreator,
  SetDateCreated,
  SetInstitution,
  SetLicense,
  SetProvider,
  SetSubject,
} from '@osf/features/preprints/store/preprints-resources-filters';
import { GetAllOptions } from '@osf/features/preprints/store/preprints-resources-filters-options';
import { FilterLabelsModel, ResourceFilterLabel } from '@shared/models';
import { BrandService } from '@shared/services';
import { BrowserTabHelper, HeaderStyleHelper } from '@shared/utils';

@Component({
  selector: 'osf-preprint-provider-discover',
  imports: [PreprintProviderHeroComponent, PreprintsResourcesComponent],
  templateUrl: './preprint-provider-discover.component.html',
  styleUrl: './preprint-provider-discover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintProviderDiscoverComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private initAfterIniReceived = false;
  private providerId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['providerId'])) ?? of(undefined)
  );

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    setCreator: SetCreator,
    setDateCreated: SetDateCreated,
    setSubject: SetSubject,
    setInstitution: SetInstitution,
    setLicense: SetLicense,
    setProvider: SetProvider,
    setSearchText: SetSearchText,
    setSortBy: SetSortBy,
    getAllOptions: GetAllOptions,
    getResources: GetResources,
    resetFiltersState: ResetFiltersState,
    resetDiscoverState: ResetState,
    setProviderIri: SetProviderIri,
  });

  searchControl = new FormControl('');

  preprintProvider = select(PreprintsSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintsSelectors.isPreprintProviderDetailsLoading);

  creatorSelected = select(PreprintsResourcesFiltersSelectors.getCreator);
  dateCreatedSelected = select(PreprintsResourcesFiltersSelectors.getDateCreated);
  subjectSelected = select(PreprintsResourcesFiltersSelectors.getSubject);
  licenseSelected = select(PreprintsResourcesFiltersSelectors.getLicense);
  providerSelected = select(PreprintsResourcesFiltersSelectors.getProvider);
  institutionSelected = select(PreprintsResourcesFiltersSelectors.getInstitution);
  sortSelected = select(PreprintsDiscoverSelectors.getSortBy);
  searchValue = select(PreprintsDiscoverSelectors.getSearchText);

  constructor() {
    effect(() => {
      const provider = this.preprintProvider();

      if (provider) {
        this.actions.setProviderIri(provider.iri);

        if (!this.initAfterIniReceived) {
          this.initAfterIniReceived = true;
          this.actions.getResources();
          this.actions.getAllOptions();
        }

        BrandService.applyBranding(provider.brand);
        HeaderStyleHelper.applyHeaderStyles(
          provider.brand.primaryColor,
          provider.brand.secondaryColor,
          provider.brand.heroBackgroundImageUrl
        );
        BrowserTabHelper.updateTabStyles(provider.faviconUrl, provider.name);
      }
    });

    // if new value for some filter was put in store, add it to route
    effect(() => this.syncFilterToQuery('Creator', this.creatorSelected()));
    effect(() => this.syncFilterToQuery('DateCreated', this.dateCreatedSelected()));
    effect(() => this.syncFilterToQuery('Subject', this.subjectSelected()));
    effect(() => this.syncFilterToQuery('License', this.licenseSelected()));
    effect(() => this.syncFilterToQuery('Provider', this.providerSelected()));
    effect(() => this.syncFilterToQuery('Institution', this.institutionSelected()));
    effect(() => this.syncSortingToQuery(this.sortSelected()));
    effect(() => this.syncSearchToQuery(this.searchValue()));

    // if new value for some filter was put in store, fetch resources
    effect(() => {
      this.creatorSelected();
      this.dateCreatedSelected();
      this.subjectSelected();
      this.licenseSelected();
      this.providerSelected();
      this.sortSelected();
      this.searchValue();
      this.actions.getResources();
    });

    this.configureSearchControl();
  }

  ngOnInit() {
    this.actions.getPreprintProviderById(this.providerId());

    // set all query parameters from route to store when page is loaded
    this.activatedRoute.queryParamMap.pipe(take(1)).subscribe((params) => {
      const activeFilters = params.get('activeFilters');
      const filters = activeFilters ? JSON.parse(activeFilters) : [];
      const sortBy = params.get('sortBy');
      const search = params.get('search');

      const creator = filters.find((p: ResourceFilterLabel) => p.filterName === FilterLabelsModel.creator);
      const dateCreated = filters.find((p: ResourceFilterLabel) => p.filterName === 'DateCreated');
      const subject = filters.find((p: ResourceFilterLabel) => p.filterName === FilterLabelsModel.subject);
      const license = filters.find((p: ResourceFilterLabel) => p.filterName === FilterLabelsModel.license);
      const provider = filters.find((p: ResourceFilterLabel) => p.filterName === FilterLabelsModel.provider);
      const institution = filters.find((p: ResourceFilterLabel) => p.filterName === FilterLabelsModel.institution);

      if (creator) {
        this.actions.setCreator(creator.label, creator.value);
      }
      if (dateCreated) {
        this.actions.setDateCreated(dateCreated.value);
      }
      if (subject) {
        this.actions.setSubject(subject.label, subject.value);
      }
      if (institution) {
        this.actions.setInstitution(institution.label, institution.value);
      }
      if (license) {
        this.actions.setLicense(license.label, license.value);
      }
      if (provider) {
        this.actions.setProvider(provider.label, provider.value);
      }
      if (sortBy) {
        this.actions.setSortBy(sortBy);
      }
      if (search) {
        this.actions.setSearchText(search);
      }

      this.actions.getAllOptions();
    });
  }

  ngOnDestroy() {
    HeaderStyleHelper.resetToDefaults();
    BrandService.resetBranding();
    BrowserTabHelper.resetToDefaults();
    this.actions.resetFiltersState();
    this.actions.resetDiscoverState();
  }

  syncFilterToQuery(filterName: string, filterValue: ResourceFilterLabel) {
    const paramMap = this.activatedRoute.snapshot.queryParamMap;
    const currentParams = { ...this.activatedRoute.snapshot.queryParams };

    const currentFiltersRaw = paramMap.get('activeFilters');

    let filters: ResourceFilterLabel[] = [];

    try {
      filters = currentFiltersRaw ? (JSON.parse(currentFiltersRaw) as ResourceFilterLabel[]) : [];
    } catch (e) {
      console.error('Invalid activeFilters format in query params', e);
    }

    const index = filters.findIndex((f) => f.filterName === filterName);

    const hasValue = !!filterValue?.value;

    if (!hasValue && index !== -1) {
      filters.splice(index, 1);
    } else if (hasValue && filterValue?.label) {
      const newFilter = {
        filterName,
        label: filterValue.label,
        value: filterValue.value,
      };

      if (index !== -1) {
        filters[index] = newFilter;
      } else {
        filters.push(newFilter);
      }
    }

    if (filters.length > 0) {
      currentParams['activeFilters'] = JSON.stringify(filters);
    } else {
      delete currentParams['activeFilters'];
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: currentParams,
      replaceUrl: true,
    });
  }

  syncSortingToQuery(sortBy: string) {
    const currentParams = { ...this.activatedRoute.snapshot.queryParams };

    if (sortBy && sortBy !== '-relevance') {
      currentParams['sortBy'] = sortBy;
    } else if (sortBy && sortBy === '-relevance') {
      delete currentParams['sortBy'];
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: currentParams,
      replaceUrl: true,
    });
  }

  syncSearchToQuery(search: string) {
    const currentParams = { ...this.activatedRoute.snapshot.queryParams };

    if (search) {
      currentParams['search'] = search;
    } else {
      delete currentParams['search'];
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: currentParams,
      replaceUrl: true,
    });
  }

  private configureSearchControl() {
    this.searchControl.valueChanges
      .pipe(skip(1), debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchText) => {
        this.actions.setSearchText(searchText ?? '');
        this.actions.getAllOptions();
      });

    effect(() => {
      const storeValue = this.searchValue();
      const currentInput = untracked(() => this.searchControl.value);

      if (storeValue && currentInput !== storeValue) {
        this.searchControl.setValue(storeValue);
      }
    });
  }
}
