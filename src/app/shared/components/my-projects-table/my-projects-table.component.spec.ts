import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { TableParameters } from '@osf/shared/models/table-parameters.model';
import { SearchInputComponent } from '@shared/components';
import { TranslateServiceMock } from '@shared/mocks';
import { MyResourcesItem } from '@shared/models/my-resources/my-resources.models';

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

  const mockItems: MyResourcesItem[] = [
    {
      id: 'project-1',
      title: 'Test Project 1',
      isPublic: true,
      dateModified: '2024-01-01T10:00:00Z',
      contributors: [
        {
          id: '1',
          userId: 'user1',
          fullName: 'Jane Smith',
        },
      ],
      type: '',
      dateCreated: '',
    },
  ];

  const mockSearchControl = new FormControl('');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProjectsTableComponent, MockComponent(SearchInputComponent)],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProjectsTableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('items', mockItems);
    fixture.componentRef.setInput('tableParams', mockTableParams);
    fixture.componentRef.setInput('searchControl', mockSearchControl);
    fixture.componentRef.setInput('sortColumn', 'title');
    fixture.componentRef.setInput('sortOrder', SortOrder.Asc);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('searchPlaceholder', 'myProjects.table.searchPlaceholder');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set items input', () => {
    expect(component.items()).toEqual(mockItems);
  });

  it('should set tableParams input', () => {
    expect(component.tableParams()).toEqual(mockTableParams);
  });

  it('should set searchControl input', () => {
    expect(component.searchControl()).toBe(mockSearchControl);
  });

  it('should set sortColumn input', () => {
    expect(component.sortColumn()).toBe('title');
  });

  it('should set sortOrder input', () => {
    expect(component.sortOrder()).toBe(SortOrder.Asc);
  });

  it('should set isLoading input', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should set searchPlaceholder input', () => {
    expect(component.searchPlaceholder()).toBe('myProjects.table.searchPlaceholder');
  });

  it('should render search input when not loading', () => {
    const compiled = fixture.nativeElement;
    const searchInput = compiled.querySelector('osf-search-input');

    expect(searchInput).toBeTruthy();
  });

  it('should render table when not loading', () => {
    const compiled = fixture.nativeElement;
    const table = compiled.querySelector('p-table');

    expect(table).toBeTruthy();
  });

  it('should render table headers', () => {
    const compiled = fixture.nativeElement;
    const headers = compiled.querySelectorAll('th');

    expect(headers.length).toBeGreaterThan(0);
  });

  it('should render table rows for items', () => {
    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('tr');

    expect(rows.length).toBeGreaterThan(1);
  });

  it('should render project title', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('span.overflow-ellipsis');

    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Test Project 1');
  });

  it('should render modified date', () => {
    const compiled = fixture.nativeElement;
    const dateElement = compiled.querySelector('td:last-child');

    expect(dateElement).toBeTruthy();
  });

  it.skip('should handle empty items array', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const emptyMessage = compiled.querySelector('td.text-center');

    expect(emptyMessage).toBeTruthy();
  });

  it('should handle undefined items', () => {
    fixture.componentRef.setInput('items', undefined);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const table = compiled.querySelector('p-table');

    expect(table).toBeTruthy();
  });

  it('should handle null items', () => {
    fixture.componentRef.setInput('items', null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const table = compiled.querySelector('p-table');

    expect(table).toBeTruthy();
  });

  it('should render sortable columns', () => {
    const compiled = fixture.nativeElement;
    const sortableColumns = compiled.querySelectorAll('th[pSortableColumn]');

    expect(sortableColumns.length).toBeGreaterThan(0);
  });

  it('should render sort icons', () => {
    const compiled = fixture.nativeElement;
    const sortIcons = compiled.querySelectorAll('p-sortIcon');

    expect(sortIcons.length).toBeGreaterThan(0);
  });

  it('should handle different sort orders', () => {
    fixture.componentRef.setInput('sortOrder', SortOrder.Desc);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const table = compiled.querySelector('p-table');

    expect(table).toBeTruthy();
  });

  it('should handle different sort columns', () => {
    fixture.componentRef.setInput('sortColumn', 'dateModified');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const table = compiled.querySelector('p-table');

    expect(table).toBeTruthy();
  });
});
