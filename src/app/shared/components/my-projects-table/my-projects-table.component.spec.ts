import { MockComponents } from 'ng-mocks';

import { SortEvent } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';

import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { MyResourcesItem } from '@osf/shared/models/my-resources/my-resources-item.model';
import { TableParameters } from '@osf/shared/models/table-parameters.model';

import { MOCK_CONTRIBUTOR } from '@testing/mocks/contributors.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { ContributorsListShortenerComponent } from '../contributors-list-shortener/contributors-list-shortener.component';
import { IconComponent } from '../icon/icon.component';

import { MyProjectsTableComponent } from './my-projects-table.component';

describe('MyProjectsTableComponent', () => {
  let component: MyProjectsTableComponent;
  let fixture: ComponentFixture<MyProjectsTableComponent>;

  const mockTableParams: TableParameters = {
    rows: 10,
    paginator: true,
    scrollable: true,
    rowsPerPageOptions: [5, 10, 20],
    totalRecords: 100,
    firstRowIndex: 0,
    defaultSortOrder: SortOrder.Asc,
    defaultSortColumn: 'name',
  };

  const mockItem: MyResourcesItem = {
    id: 'project-1',
    title: 'Test Project 1',
    isPublic: true,
    dateModified: '2024-01-01T10:00:00Z',
    contributors: [MOCK_CONTRIBUTOR],
    type: 'nodes',
    dateCreated: '2024-01-01T00:00:00Z',
  };

  const mockItems = [mockItem];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MyProjectsTableComponent, ...MockComponents(IconComponent, ContributorsListShortenerComponent)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(MyProjectsTableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('tableParams', mockTableParams);
  });

  it('should create with default input values', () => {
    expect(component).toBeTruthy();
  });

  it('should default items to an empty array', () => {
    expect(component.items()).toEqual([]);
  });

  it('should accept items input', () => {
    fixture.componentRef.setInput('items', mockItems);

    expect(component.items()).toEqual(mockItems);
  });

  it('should accept tableParams input', () => {
    expect(component.tableParams()).toEqual(mockTableParams);
  });

  it('should default sortColumn to undefined and sortOrder to Asc', () => {
    expect(component.sortColumn()).toBeUndefined();
    expect(component.sortOrder()).toBe(SortOrder.Asc);
  });

  it('should accept sortColumn and sortOrder inputs', () => {
    fixture.componentRef.setInput('sortColumn', 'title');
    fixture.componentRef.setInput('sortOrder', SortOrder.Desc);

    expect(component.sortColumn()).toBe('title');
    expect(component.sortOrder()).toBe(SortOrder.Desc);
  });

  it('should default isLoading to false', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should accept isLoading input', () => {
    fixture.componentRef.setInput('isLoading', true);

    expect(component.isLoading()).toBe(true);
  });

  it('should default emptyMessageKey to common.search.noResultsFound', () => {
    expect(component.emptyMessageKey()).toBe('common.search.noResultsFound');
  });

  it('should accept emptyMessageKey input', () => {
    fixture.componentRef.setInput('emptyMessageKey', 'myProjects.empty.noProjects');

    expect(component.emptyMessageKey()).toBe('myProjects.empty.noProjects');
  });

  it('should default downloadCellTemplate to undefined', () => {
    expect(component.downloadCellTemplate()).toBeUndefined();
  });

  it('should return columnCount of 3 when download column is hidden', () => {
    expect(component.columnCount()).toBe(3);
  });

  it('should return columnCount of 4 when downloadCellTemplate is provided', () => {
    fixture.componentRef.setInput('downloadCellTemplate', {} as TemplateRef<{ $implicit: MyResourcesItem }>);

    expect(component.columnCount()).toBe(4);
  });

  it('should expose skeletonData with 10 placeholder items', () => {
    expect(component.skeletonData).toHaveLength(10);
    expect(component.skeletonData.every((item) => !item.id)).toBe(true);
  });

  it('should emit pageChange when onPageChange is called', () => {
    vi.spyOn(component.pageChange, 'emit');
    const event = { first: 10, rows: 10 } as TablePageEvent;

    component.onPageChange(event);

    expect(component.pageChange.emit).toHaveBeenCalledWith(event);
  });

  it('should emit sort when onSort is called', () => {
    vi.spyOn(component.sort, 'emit');
    const event = { field: 'title', order: SortOrder.Desc } as SortEvent;

    component.onSort(event);

    expect(component.sort.emit).toHaveBeenCalledWith(event);
  });

  it('should emit itemClick when onItemClick is called', () => {
    vi.spyOn(component.itemClick, 'emit');

    component.onItemClick(mockItems[0]);

    expect(component.itemClick.emit).toHaveBeenCalledWith(mockItems[0]);
  });
});
