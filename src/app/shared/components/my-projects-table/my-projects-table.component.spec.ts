import { MockComponents } from 'ng-mocks';

import { SortEvent } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';

import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { MyResourcesItem } from '@osf/shared/models/my-resources/my-resources-item.model';
import { TableParameters } from '@osf/shared/models/table-parameters.model';

import { MOCK_MY_RESOURCES_ITEM_PROJECT } from '@testing/mocks/my-resources.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { ContributorsListShortenerComponent } from '../contributors-list-shortener/contributors-list-shortener.component';
import { IconComponent } from '../icon/icon.component';
import { MigratedLabelComponent } from '../migrated-label/migrated-label.component';

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

  function setup(
    overrides: {
      items?: MyResourcesItem[];
      isLoading?: boolean;
      emptyMessageKey?: string;
      downloadCellTemplate?: TemplateRef<{ $implicit: MyResourcesItem }>;
      sortColumn?: string;
      sortOrder?: SortOrder;
    } = {}
  ) {
    TestBed.configureTestingModule({
      imports: [
        MyProjectsTableComponent,
        ...MockComponents(IconComponent, ContributorsListShortenerComponent, MigratedLabelComponent),
      ],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(MyProjectsTableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('tableParams', mockTableParams);
    fixture.componentRef.setInput('items', overrides.items ?? []);
    fixture.componentRef.setInput('isLoading', overrides.isLoading ?? false);
    fixture.componentRef.setInput('emptyMessageKey', overrides.emptyMessageKey ?? 'common.search.noResultsFound');
    fixture.componentRef.setInput('sortColumn', overrides.sortColumn);
    fixture.componentRef.setInput('sortOrder', overrides.sortOrder ?? SortOrder.Asc);

    if (overrides.downloadCellTemplate) {
      fixture.componentRef.setInput('downloadCellTemplate', overrides.downloadCellTemplate);
    }

    fixture.detectChanges();
  }

  it('should render items and emit itemClick on row click', () => {
    setup({ items: [MOCK_MY_RESOURCES_ITEM_PROJECT] });
    const itemClickSpy = vi.fn();
    component.itemClick.subscribe(itemClickSpy);

    expect(fixture.nativeElement.textContent).toContain(MOCK_MY_RESOURCES_ITEM_PROJECT.title);

    const row = fixture.nativeElement.querySelector('tbody tr') as HTMLTableRowElement;
    row.click();

    expect(itemClickSpy).toHaveBeenCalledWith(MOCK_MY_RESOURCES_ITEM_PROJECT);
  });

  it('should show loading skeletons when isLoading is true', () => {
    setup({ isLoading: true, items: [MOCK_MY_RESOURCES_ITEM_PROJECT] });

    expect(fixture.nativeElement.querySelectorAll('.loading-row')).toHaveLength(10);
    expect(fixture.nativeElement.querySelector('p-skeleton')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain(MOCK_MY_RESOURCES_ITEM_PROJECT.title);
  });

  it('should show empty message key when there are no items', () => {
    setup({
      items: [],
      emptyMessageKey: 'myProjects.table.emptyState.all.both',
    });

    expect(fixture.nativeElement.textContent).toContain('myProjects.table.emptyState.all.both');
  });

  it('should show download column when downloadCellTemplate is provided', () => {
    setup({
      isLoading: true,
      downloadCellTemplate: {} as TemplateRef<{ $implicit: MyResourcesItem }>,
    });

    expect(fixture.nativeElement.querySelectorAll('thead th')).toHaveLength(4);
    expect(component.columnCount()).toBe(4);
  });

  it('should emit pageChange and sort from table events', () => {
    setup({ items: [MOCK_MY_RESOURCES_ITEM_PROJECT] });
    const pageChangeSpy = vi.fn();
    const sortSpy = vi.fn();
    component.pageChange.subscribe(pageChangeSpy);
    component.sort.subscribe(sortSpy);

    const pageEvent = { first: 10, rows: 10 } as TablePageEvent;
    const sortEvent = { field: 'title', order: SortOrder.Desc } as SortEvent;
    const table = fixture.debugElement.query(By.css('p-table'));

    table.triggerEventHandler('onPage', pageEvent);
    table.triggerEventHandler('onSort', sortEvent);

    expect(pageChangeSpy).toHaveBeenCalledWith(pageEvent);
    expect(sortSpy).toHaveBeenCalledWith(sortEvent);
  });
});
