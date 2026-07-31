import { ResourceSearchMode } from '@osf/shared/enums/resource-search-mode.enum';
import { ResourceVisibilityFilter } from '@osf/shared/enums/resource-visibility-filter.enum';

import { getMyProjectsEmptyMessageKey } from './get-my-projects-empty-message-key.util';

describe('getMyProjectsEmptyMessageKey', () => {
  it('should return all visibility messages for User search mode', () => {
    expect(getMyProjectsEmptyMessageKey(ResourceSearchMode.User, ResourceVisibilityFilter.All)).toBe(
      'myProjects.table.emptyState.all.both'
    );
    expect(getMyProjectsEmptyMessageKey(ResourceSearchMode.User, ResourceVisibilityFilter.Public)).toBe(
      'myProjects.table.emptyState.all.public'
    );
    expect(getMyProjectsEmptyMessageKey(ResourceSearchMode.User, ResourceVisibilityFilter.Private)).toBe(
      'myProjects.table.emptyState.all.private'
    );
  });

  it('should return projects visibility messages for Root search mode', () => {
    expect(getMyProjectsEmptyMessageKey(ResourceSearchMode.Root, ResourceVisibilityFilter.All)).toBe(
      'myProjects.table.emptyState.projects.both'
    );
    expect(getMyProjectsEmptyMessageKey(ResourceSearchMode.Root, ResourceVisibilityFilter.Public)).toBe(
      'myProjects.table.emptyState.projects.public'
    );
    expect(getMyProjectsEmptyMessageKey(ResourceSearchMode.Root, ResourceVisibilityFilter.Private)).toBe(
      'myProjects.table.emptyState.projects.private'
    );
  });

  it('should return components visibility messages for Component search mode', () => {
    expect(getMyProjectsEmptyMessageKey(ResourceSearchMode.Component, ResourceVisibilityFilter.All)).toBe(
      'myProjects.table.emptyState.components.both'
    );
    expect(getMyProjectsEmptyMessageKey(ResourceSearchMode.Component, ResourceVisibilityFilter.Public)).toBe(
      'myProjects.table.emptyState.components.public'
    );
    expect(getMyProjectsEmptyMessageKey(ResourceSearchMode.Component, ResourceVisibilityFilter.Private)).toBe(
      'myProjects.table.emptyState.components.private'
    );
  });
});
