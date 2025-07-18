import { select, Store } from '@ngxs/store';

import { take } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ResourcesComponent } from '@osf/features/search/components';
import { ResourceTab } from '@osf/shared/enums';
import { FilterLabelsModel, ResourceFilterLabel } from '@osf/shared/models';

import { SearchSelectors, SetResourceTab, SetSearchText, SetSortBy } from '../../store';
import { GetAllOptions } from '../filters/store';
import {
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
} from '../resource-filters/store';

@Component({
  selector: 'osf-resources-wrapper',
  imports: [ResourcesComponent],
  templateUrl: './resources-wrapper.component.html',
  styleUrl: './resources-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesWrapperComponent implements OnInit {
  readonly store = inject(Store);
  readonly activeRoute = inject(ActivatedRoute);
  readonly router = inject(Router);

  creatorSelected = select(ResourceFiltersSelectors.getCreator);
  dateCreatedSelected = select(ResourceFiltersSelectors.getDateCreated);
  funderSelected = select(ResourceFiltersSelectors.getFunder);
  subjectSelected = select(ResourceFiltersSelectors.getSubject);
  licenseSelected = select(ResourceFiltersSelectors.getLicense);
  resourceTypeSelected = select(ResourceFiltersSelectors.getResourceType);
  institutionSelected = select(ResourceFiltersSelectors.getInstitution);
  providerSelected = select(ResourceFiltersSelectors.getProvider);
  partOfCollectionSelected = select(ResourceFiltersSelectors.getPartOfCollection);
  sortSelected = select(SearchSelectors.getSortBy);
  searchInput = select(SearchSelectors.getSearchText);
  resourceTabSelected = select(SearchSelectors.getResourceTab);
  isMyProfilePage = select(SearchSelectors.getIsMyProfile);

  constructor() {
    effect(() => this.syncFilterToQuery('Creator', this.creatorSelected()));
    effect(() => this.syncFilterToQuery('DateCreated', this.dateCreatedSelected()));
    effect(() => this.syncFilterToQuery('Funder', this.funderSelected()));
    effect(() => this.syncFilterToQuery('Subject', this.subjectSelected()));
    effect(() => this.syncFilterToQuery('License', this.licenseSelected()));
    effect(() => this.syncFilterToQuery('ResourceType', this.resourceTypeSelected()));
    effect(() => this.syncFilterToQuery('Institution', this.institutionSelected()));
    effect(() => this.syncFilterToQuery('Provider', this.providerSelected()));
    effect(() => this.syncFilterToQuery('PartOfCollection', this.partOfCollectionSelected()));
    effect(() => this.syncSortingToQuery(this.sortSelected()));
    effect(() => this.syncSearchToQuery(this.searchInput()));
    effect(() => this.syncResourceTabToQuery(this.resourceTabSelected()));
  }

  ngOnInit() {
    this.activeRoute.queryParamMap.pipe(take(1)).subscribe((params) => {
      const activeFilters = params.get('activeFilters');
      const filters = activeFilters ? JSON.parse(activeFilters) : [];
      const sortBy = params.get('sortBy');
      const search = params.get('search');
      const resourceTab = params.get('resourceTab');

      const creator = filters.find((p: ResourceFilterLabel) => p.filterName === FilterLabelsModel.creator);
      const dateCreated = filters.find((p: ResourceFilterLabel) => p.filterName === 'DateCreated');
      const funder = filters.find((p: ResourceFilterLabel) => p.filterName === FilterLabelsModel.funder);
      const subject = filters.find((p: ResourceFilterLabel) => p.filterName === FilterLabelsModel.subject);
      const license = filters.find((p: ResourceFilterLabel) => p.filterName === FilterLabelsModel.license);
      const resourceType = filters.find((p: ResourceFilterLabel) => p.filterName === 'ResourceType');
      const institution = filters.find((p: ResourceFilterLabel) => p.filterName === FilterLabelsModel.institution);
      const provider = filters.find((p: ResourceFilterLabel) => p.filterName === FilterLabelsModel.provider);
      const partOfCollection = filters.find((p: ResourceFilterLabel) => p.filterName === 'PartOfCollection');

      if (creator) {
        this.store.dispatch(new SetCreator(creator.label, creator.value));
      }
      if (dateCreated) {
        this.store.dispatch(new SetDateCreated(dateCreated.value));
      }
      if (funder) {
        this.store.dispatch(new SetFunder(funder.label, funder.value));
      }
      if (subject) {
        this.store.dispatch(new SetSubject(subject.label, subject.value));
      }
      if (license) {
        this.store.dispatch(new SetLicense(license.label, license.value));
      }
      if (resourceType) {
        this.store.dispatch(new SetResourceType(resourceType.label, resourceType.value));
      }
      if (institution) {
        this.store.dispatch(new SetInstitution(institution.label, institution.value));
      }
      if (provider) {
        this.store.dispatch(new SetProvider(provider.label, provider.value));
      }
      if (partOfCollection) {
        this.store.dispatch(new SetPartOfCollection(partOfCollection.label, partOfCollection.value));
      }

      if (sortBy) {
        this.store.dispatch(new SetSortBy(sortBy));
      }
      if (search) {
        this.store.dispatch(new SetSearchText(search));
      }
      if (resourceTab) {
        this.store.dispatch(new SetResourceTab(+resourceTab));
      }

      this.store.dispatch(GetAllOptions);
    });
  }

  syncFilterToQuery(filterName: string, filterValue: ResourceFilterLabel) {
    if (this.isMyProfilePage()) {
      return;
    }
    const paramMap = this.activeRoute.snapshot.queryParamMap;
    const currentParams = { ...this.activeRoute.snapshot.queryParams };

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

    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: currentParams,
      replaceUrl: true,
    });
  }

  syncSortingToQuery(sortBy: string) {
    if (this.isMyProfilePage()) {
      return;
    }
    const currentParams = { ...this.activeRoute.snapshot.queryParams };

    if (sortBy && sortBy !== '-relevance') {
      currentParams['sortBy'] = sortBy;
    } else if (sortBy && sortBy === '-relevance') {
      delete currentParams['sortBy'];
    }

    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: currentParams,
      replaceUrl: true,
    });
  }

  syncSearchToQuery(search: string) {
    if (this.isMyProfilePage()) {
      return;
    }
    const currentParams = { ...this.activeRoute.snapshot.queryParams };

    if (search) {
      currentParams['search'] = search;
    } else {
      delete currentParams['search'];
    }

    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: currentParams,
      replaceUrl: true,
    });
  }

  syncResourceTabToQuery(resourceTab: ResourceTab) {
    if (this.isMyProfilePage()) {
      return;
    }
    const currentParams = { ...this.activeRoute.snapshot.queryParams };

    if (resourceTab) {
      currentParams['resourceTab'] = resourceTab;
    } else {
      delete currentParams['resourceTab'];
    }

    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: currentParams,
      replaceUrl: true,
    });
  }
}
