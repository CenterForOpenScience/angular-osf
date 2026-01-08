import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { TablePageEvent } from 'primeng/table';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { ResourceSearchMode } from '@osf/shared/enums/resource-search-mode.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { MyResourcesSelectors } from '@osf/shared/stores/my-resources';
import { NodeLinksSelectors } from '@osf/shared/stores/node-links';
import { MyResourcesItem } from '@shared/models/my-resources/my-resources.models';

import { ProjectOverviewSelectors } from '../../store';

import { LinkResourceDialogComponent } from './link-resource-dialog.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import {
  MOCK_MY_RESOURCES_ITEM_PROJECT,
  MOCK_MY_RESOURCES_ITEM_PROJECT_PRIVATE,
  MOCK_MY_RESOURCES_ITEM_REGISTRATION,
} from '@testing/mocks/my-resources.mock';
import { MOCK_NODE_WITH_ADMIN } from '@testing/mocks/node.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('LinkResourceDialogComponent', () => {
  let component: LinkResourceDialogComponent;
  let fixture: ComponentFixture<LinkResourceDialogComponent>;
  let store: Store;
  let dialogRef: { close: jest.Mock };

  const mockProjects: MyResourcesItem[] = [MOCK_MY_RESOURCES_ITEM_PROJECT, MOCK_MY_RESOURCES_ITEM_PROJECT_PRIVATE];

  const mockRegistrations: MyResourcesItem[] = [MOCK_MY_RESOURCES_ITEM_REGISTRATION];

  const mockLinkedResources = [{ ...MOCK_NODE_WITH_ADMIN, id: 'project-1', title: 'Linked Project 1' }];

  const mockCurrentProject = { ...MOCK_NODE_WITH_ADMIN, id: 'current-project-id' };

  beforeEach(async () => {
    dialogRef = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LinkResourceDialogComponent, OSFTestingModule, ...MockComponents(SearchInputComponent)],
      providers: [
        provideMockStore({
          signals: [
            { selector: MyResourcesSelectors.getProjects, value: mockProjects },
            { selector: MyResourcesSelectors.getProjectsLoading, value: false },
            { selector: MyResourcesSelectors.getRegistrations, value: mockRegistrations },
            { selector: MyResourcesSelectors.getRegistrationsLoading, value: false },
            { selector: MyResourcesSelectors.getTotalProjects, value: 2 },
            { selector: MyResourcesSelectors.getTotalRegistrations, value: 1 },
            { selector: NodeLinksSelectors.getNodeLinksSubmitting, value: false },
            { selector: NodeLinksSelectors.getLinkedResources, value: mockLinkedResources },
            { selector: ProjectOverviewSelectors.getProject, value: mockCurrentProject },
          ],
        }),
        { provide: DynamicDialogRefMock.provide, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkResourceDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should initialize with default values', () => {
    expect(component.currentPage()).toBe(1);
    expect(component.searchMode()).toBe(ResourceSearchMode.User);
    expect(component.resourceType()).toBe(ResourceType.Project);
    expect(component.searchControl.value).toBe('');
  });

  it('should initialize skeleton data with correct length', () => {
    expect(component.skeletonData.length).toBe(component.tableRows);
  });

  it('should compute currentResourceId from currentProject', () => {
    expect(component.currentResourceId()).toBe('current-project-id');
  });

  it('should compute isCurrentTableLoading for registrations', () => {
    component.resourceType.set(ResourceType.Registration);
    fixture.detectChanges();
    expect(component.isCurrentTableLoading()).toBe(false);
  });

  it('should compute currentTotalCount for registrations', () => {
    component.resourceType.set(ResourceType.Registration);
    fixture.detectChanges();
    expect(component.currentTotalCount()).toBe(1);
  });

  it('should compute tableParams correctly', () => {
    const params = component.tableParams();
    expect(params.rows).toBe(component.tableRows);
    expect(params.firstRowIndex).toBe(0);
    expect(params.paginator).toBe(false);
    expect(params.totalRecords).toBe(2);
  });

  it('should compute linkedResourceIds as a Set', () => {
    const linkedIds = component.linkedResourceIds();
    expect(linkedIds).toBeInstanceOf(Set);
    expect(linkedIds.has('project-1')).toBe(true);
    expect(linkedIds.has('project-2')).toBe(false);
  });

  it('should update searchMode and reset to first page', () => {
    component.currentPage.set(2);
    component.onSearchModeChange(ResourceSearchMode.All);

    expect(component.searchMode()).toBe(ResourceSearchMode.All);
    expect(component.currentPage()).toBe(1);
  });

  it('should update resourceType and reset to first page', () => {
    component.currentPage.set(2);
    component.onObjectTypeChange(ResourceType.Registration);

    expect(component.resourceType()).toBe(ResourceType.Registration);
    expect(component.currentPage()).toBe(1);
  });

  it('should update currentPage and trigger search', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event: TablePageEvent = {
      first: 6,
      rows: 6,
    };

    component.onPageChange(event);

    expect(component.currentPage()).toBe(2);
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should return true for linked items', () => {
    expect(component.isItemLinked('project-1')).toBe(true);
  });

  it('should return false for non-linked items', () => {
    expect(component.isItemLinked('project-2')).toBe(false);
  });

  it('should close the dialog', () => {
    component.handleCloseDialog();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should trigger search when searchMode changes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.onSearchModeChange(ResourceSearchMode.All);

    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should trigger search when resourceType changes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.onObjectTypeChange(ResourceType.Registration);

    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should handle page change with zero first value', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event: TablePageEvent = {
      first: 0,
      rows: 6,
    };

    component.onPageChange(event);

    expect(component.currentPage()).toBe(1);
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
