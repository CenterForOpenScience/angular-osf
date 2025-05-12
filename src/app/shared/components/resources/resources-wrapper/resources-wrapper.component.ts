import { Store } from '@ngxs/store';

import { take } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ResourceTab } from '@osf/features/search/models/resource-tab.enum';
import {
  SearchSelectors,
  SetResourceTab,
  SetSearchText,
  SetSortBy,
} from '@osf/features/search/store';
import { GetAllOptions } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.actions';
import { FilterLabels } from '@shared/components/resources/resource-filters/models/filter-labels';
import {
  ResourceFilterLabel,
  ResourceFiltersSelectors,
  SetCreator,
  SetDateCreated,
  SetFunder,
  SetInstitution,
  SetLicense,
  SetPartOfCollection,
  SetProvider,
  SetResourceType,
  SetSubject,
} from '@shared/components/resources/resource-filters/store';
import { ResourcesComponent } from '@shared/components/resources/resources.component';

@Component({
  selector: 'osf-resources-wrapper',
  imports: [ResourcesComponent],
  templateUrl: './resources-wrapper.component.html',
  styleUrl: './resources-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesWrapperComponent implements OnInit {
  readonly #store = inject(Store);
  readonly #activeRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);

  creatorSelected = this.#store.selectSignal(
    ResourceFiltersSelectors.getCreator,
  );
  dateCreatedSelected = this.#store.selectSignal(
    ResourceFiltersSelectors.getDateCreated,
  );
  funderSelected = this.#store.selectSignal(ResourceFiltersSelectors.getFunder);
  subjectSelected = this.#store.selectSignal(
    ResourceFiltersSelectors.getSubject,
  );
  licenseSelected = this.#store.selectSignal(
    ResourceFiltersSelectors.getLicense,
  );
  resourceTypeSelected = this.#store.selectSignal(
    ResourceFiltersSelectors.getResourceType,
  );
  institutionSelected = this.#store.selectSignal(
    ResourceFiltersSelectors.getInstitution,
  );
  providerSelected = this.#store.selectSignal(
    ResourceFiltersSelectors.getProvider,
  );
  partOfCollectionSelected = this.#store.selectSignal(
    ResourceFiltersSelectors.getPartOfCollection,
  );
  sortSelected = this.#store.selectSignal(SearchSelectors.getSortBy);
  searchInput = this.#store.selectSignal(SearchSelectors.getSearchText);
  resourceTabSelected = this.#store.selectSignal(
    SearchSelectors.getResourceTab,
  );
  isMyProfilePage = this.#store.selectSignal(SearchSelectors.getIsMyProfile);

  constructor() {
    // if new value for some filter was put in store, add it to route
    effect(() => this.syncFilterToQuery('Creator', this.creatorSelected()));
    effect(() =>
      this.syncFilterToQuery('DateCreated', this.dateCreatedSelected()),
    );
    effect(() => this.syncFilterToQuery('Funder', this.funderSelected()));
    effect(() => this.syncFilterToQuery('Subject', this.subjectSelected()));
    effect(() => this.syncFilterToQuery('License', this.licenseSelected()));
    effect(() =>
      this.syncFilterToQuery('ResourceType', this.resourceTypeSelected()),
    );
    effect(() =>
      this.syncFilterToQuery('Institution', this.institutionSelected()),
    );
    effect(() => this.syncFilterToQuery('Provider', this.providerSelected()));
    effect(() =>
      this.syncFilterToQuery(
        'PartOfCollection',
        this.partOfCollectionSelected(),
      ),
    );
    effect(() => this.syncSortingToQuery(this.sortSelected()));
    effect(() => this.syncSearchToQuery(this.searchInput()));
    effect(() => this.syncResourceTabToQuery(this.resourceTabSelected()));
  }

  ngOnInit() {
    // set all query parameters from route to store when page is loaded
    this.#activeRoute.queryParamMap.pipe(take(1)).subscribe((params) => {
      const activeFilters = params.get('activeFilters');
      const filters = activeFilters ? JSON.parse(activeFilters) : [];
      const sortBy = params.get('sortBy');
      const search = params.get('search');
      const resourceTab = params.get('resourceTab');

      const creator = filters.find(
        (p: ResourceFilterLabel) => p.filterName === FilterLabels.creator,
      );
      const dateCreated = filters.find(
        (p: ResourceFilterLabel) => p.filterName === 'DateCreated',
      );
      const funder = filters.find(
        (p: ResourceFilterLabel) => p.filterName === FilterLabels.funder,
      );
      const subject = filters.find(
        (p: ResourceFilterLabel) => p.filterName === FilterLabels.subject,
      );
      const license = filters.find(
        (p: ResourceFilterLabel) => p.filterName === FilterLabels.license,
      );
      const resourceType = filters.find(
        (p: ResourceFilterLabel) => p.filterName === 'ResourceType',
      );
      const institution = filters.find(
        (p: ResourceFilterLabel) => p.filterName === FilterLabels.institution,
      );
      const provider = filters.find(
        (p: ResourceFilterLabel) => p.filterName === FilterLabels.provider,
      );
      const partOfCollection = filters.find(
        (p: ResourceFilterLabel) => p.filterName === 'PartOfCollection',
      );

      if (creator) {
        this.#store.dispatch(new SetCreator(creator.label, creator.value));
      }
      if (dateCreated) {
        this.#store.dispatch(new SetDateCreated(dateCreated.value));
      }
      if (funder) {
        this.#store.dispatch(new SetFunder(funder.label, funder.value));
      }
      if (subject) {
        this.#store.dispatch(new SetSubject(subject.label, subject.value));
      }
      if (license) {
        this.#store.dispatch(new SetLicense(license.label, license.value));
      }
      if (resourceType) {
        this.#store.dispatch(
          new SetResourceType(resourceType.label, resourceType.value),
        );
      }
      if (institution) {
        this.#store.dispatch(
          new SetInstitution(institution.label, institution.value),
        );
      }
      if (provider) {
        this.#store.dispatch(new SetProvider(provider.label, provider.value));
      }
      if (partOfCollection) {
        this.#store.dispatch(
          new SetPartOfCollection(
            partOfCollection.label,
            partOfCollection.value,
          ),
        );
      }

      if (sortBy) {
        this.#store.dispatch(new SetSortBy(sortBy));
      }
      if (search) {
        this.#store.dispatch(new SetSearchText(search));
      }
      if (resourceTab) {
        this.#store.dispatch(new SetResourceTab(+resourceTab));
      }

      this.#store.dispatch(GetAllOptions);
    });
  }

  syncFilterToQuery(filterName: string, filterValue: ResourceFilterLabel) {
    if (this.isMyProfilePage()) {
      return;
    }
    const paramMap = this.#activeRoute.snapshot.queryParamMap;
    const currentParams = { ...this.#activeRoute.snapshot.queryParams };

    // Read existing parameters
    const currentFiltersRaw = paramMap.get('activeFilters');

    let filters: ResourceFilterLabel[] = [];

    try {
      filters = currentFiltersRaw
        ? (JSON.parse(currentFiltersRaw) as ResourceFilterLabel[])
        : [];
    } catch (e) {
      console.error('Invalid activeFilters format in query params', e);
    }

    const index = filters.findIndex((f) => f.filterName === filterName);

    const hasValue = !!filterValue?.value;

    // Update activeFilters array
    if (!hasValue && index !== -1) {
      filters.splice(index, 1);
    } else if (hasValue && filterValue?.label && filterValue.value) {
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

    // Navigation
    this.#router.navigate([], {
      relativeTo: this.#activeRoute,
      queryParams: currentParams,
      replaceUrl: true,
    });
  }

  syncSortingToQuery(sortBy: string) {
    if (this.isMyProfilePage()) {
      return;
    }
    const currentParams = { ...this.#activeRoute.snapshot.queryParams };

    if (sortBy && sortBy !== '-relevance') {
      currentParams['sortBy'] = sortBy;
    } else if (sortBy && sortBy === '-relevance') {
      delete currentParams['sortBy'];
    }

    this.#router.navigate([], {
      relativeTo: this.#activeRoute,
      queryParams: currentParams,
      replaceUrl: true,
    });
  }

  syncSearchToQuery(search: string) {
    if (this.isMyProfilePage()) {
      return;
    }
    const currentParams = { ...this.#activeRoute.snapshot.queryParams };

    if (search) {
      currentParams['search'] = search;
    } else {
      delete currentParams['search'];
    }

    this.#router.navigate([], {
      relativeTo: this.#activeRoute,
      queryParams: currentParams,
      replaceUrl: true,
    });
  }

  syncResourceTabToQuery(resourceTab: ResourceTab) {
    if (this.isMyProfilePage()) {
      return;
    }
    const currentParams = { ...this.#activeRoute.snapshot.queryParams };

    if (resourceTab) {
      currentParams['resourceTab'] = resourceTab;
    } else {
      delete currentParams['resourceTab'];
    }

    this.#router.navigate([], {
      relativeTo: this.#activeRoute,
      queryParams: currentParams,
      replaceUrl: true,
    });
  }
}
