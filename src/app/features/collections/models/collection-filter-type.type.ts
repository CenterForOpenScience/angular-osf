import { CollectionsSelectors } from '@osf/features/collections/store';

export type CollectionFilterType = keyof ReturnType<typeof CollectionsSelectors.getAllSelectedFilters>;
