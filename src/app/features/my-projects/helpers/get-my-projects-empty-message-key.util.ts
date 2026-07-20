import { ResourceSearchMode } from '@osf/shared/enums/resource-search-mode.enum';
import { ResourceVisibilityFilter } from '@osf/shared/enums/resource-visibility-filter.enum';

const EMPTY_STATE_KEYS: Record<ResourceSearchMode, Record<ResourceVisibilityFilter, string>> = {
  [ResourceSearchMode.All]: {
    [ResourceVisibilityFilter.All]: 'myProjects.table.emptyState.all.both',
    [ResourceVisibilityFilter.Public]: 'myProjects.table.emptyState.all.public',
    [ResourceVisibilityFilter.Private]: 'myProjects.table.emptyState.all.private',
  },
  [ResourceSearchMode.Root]: {
    [ResourceVisibilityFilter.All]: 'myProjects.table.emptyState.projects.both',
    [ResourceVisibilityFilter.Public]: 'myProjects.table.emptyState.projects.public',
    [ResourceVisibilityFilter.Private]: 'myProjects.table.emptyState.projects.private',
  },
  [ResourceSearchMode.Component]: {
    [ResourceVisibilityFilter.All]: 'myProjects.table.emptyState.components.both',
    [ResourceVisibilityFilter.Public]: 'myProjects.table.emptyState.components.public',
    [ResourceVisibilityFilter.Private]: 'myProjects.table.emptyState.components.private',
  },
  [ResourceSearchMode.User]: {
    [ResourceVisibilityFilter.All]: 'myProjects.table.emptyState.all.both',
    [ResourceVisibilityFilter.Public]: 'myProjects.table.emptyState.all.public',
    [ResourceVisibilityFilter.Private]: 'myProjects.table.emptyState.all.private',
  },
};

export function getMyProjectsEmptyMessageKey(
  searchMode: ResourceSearchMode,
  visibilityFilter: ResourceVisibilityFilter
): string {
  return EMPTY_STATE_KEYS[searchMode][visibilityFilter];
}
