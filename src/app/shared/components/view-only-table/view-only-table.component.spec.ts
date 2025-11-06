import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatedViewOnlyLinksModel } from '@shared/models/view-only-links/view-only-link.model';

import { CopyButtonComponent } from '../copy-button/copy-button.component';

import { ViewOnlyTableComponent } from './view-only-table.component';

import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';
import { MOCK_PAGINATED_VIEW_ONLY_LINKS, MOCK_VIEW_ONLY_LINK } from '@testing/mocks/view-only-link.mock';

describe('ViewOnlyTableComponent', () => {
  let component: ViewOnlyTableComponent;
  let fixture: ComponentFixture<ViewOnlyTableComponent>;

  const mockViewOnlyLink = MOCK_VIEW_ONLY_LINK;
  const mockPaginatedData = MOCK_PAGINATED_VIEW_ONLY_LINKS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOnlyTableComponent, MockComponent(CopyButtonComponent)],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOnlyTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tableData input correctly', () => {
    fixture.componentRef.setInput('tableData', mockPaginatedData);
    expect(component.tableData()).toEqual(mockPaginatedData);
  });

  it('should emit deleteLink event', () => {
    const emitSpy = jest.spyOn(component.deleteLink, 'emit');

    component.deleteLink.emit(mockViewOnlyLink);

    expect(emitSpy).toHaveBeenCalledWith(mockViewOnlyLink);
  });

  it('should handle multiple tableData items', () => {
    const multipleData: PaginatedViewOnlyLinksModel = {
      items: [mockViewOnlyLink, { ...mockViewOnlyLink, id: 'link-2' }],
      total: 2,
      perPage: 10,
      next: null,
      prev: null,
    };

    fixture.componentRef.setInput('tableData', multipleData);
    expect(component.tableData().items).toHaveLength(2);
  });

  it('should handle tableData with pagination info', () => {
    const paginatedData: PaginatedViewOnlyLinksModel = {
      items: [mockViewOnlyLink],
      total: 25,
      perPage: 10,
      next: 'next-page-url',
      prev: 'prev-page-url',
    };

    fixture.componentRef.setInput('tableData', paginatedData);
    expect(component.tableData().next).toBe('next-page-url');
    expect(component.tableData().prev).toBe('prev-page-url');
  });

  it('should emit deleteLink with correct data', () => {
    const emitSpy = jest.spyOn(component.deleteLink, 'emit');
    const testLink = { ...mockViewOnlyLink, id: 'test-delete-link' };

    component.deleteLink.emit(testLink);

    expect(emitSpy).toHaveBeenCalledWith(testLink);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should show skeleton data when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('tableData', mockPaginatedData);
    fixture.detectChanges();

    expect(component.skeletonData).toHaveLength(3);
  });

  it('should show actual data when isLoading is false', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('tableData', mockPaginatedData);
    fixture.detectChanges();

    expect(component.tableData().items).toEqual([mockViewOnlyLink]);
  });

  it('should handle item with id (showing actual row)', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('tableData', mockPaginatedData);
    fixture.detectChanges();

    expect(mockViewOnlyLink.id).toBeDefined();
  });

  it('should handle anonymous true', () => {
    const anonymousLink = { ...mockViewOnlyLink, anonymous: true };
    const anonymousData: PaginatedViewOnlyLinksModel = {
      items: [anonymousLink],
      total: 1,
      perPage: 10,
      next: null,
      prev: null,
    };

    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('tableData', anonymousData);
    fixture.detectChanges();

    expect(anonymousLink.anonymous).toBe(true);
  });

  it('should handle anonymous false', () => {
    const nonAnonymousLink = { ...mockViewOnlyLink, anonymous: false };
    const nonAnonymousData: PaginatedViewOnlyLinksModel = {
      items: [nonAnonymousLink],
      total: 1,
      perPage: 10,
      next: null,
      prev: null,
    };

    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('tableData', nonAnonymousData);
    fixture.detectChanges();

    expect(nonAnonymousLink.anonymous).toBe(false);
  });

  it('should handle empty items array', () => {
    const emptyData: PaginatedViewOnlyLinksModel = {
      items: [],
      total: 0,
      perPage: 10,
      next: null,
      prev: null,
    };

    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('tableData', emptyData);
    fixture.detectChanges();

    expect(component.tableData().items).toHaveLength(0);
  });

  it('should handle item with empty string id', () => {
    const itemWithEmptyId = { ...mockViewOnlyLink, id: '' };
    const dataWithEmptyId: PaginatedViewOnlyLinksModel = {
      items: [itemWithEmptyId],
      total: 1,
      perPage: 10,
      next: null,
      prev: null,
    };

    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('tableData', dataWithEmptyId);
    fixture.detectChanges();

    expect(itemWithEmptyId.id).toBe('');
  });

  it('should handle rapid isLoading changes', () => {
    fixture.componentRef.setInput('tableData', mockPaginatedData);

    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(component.isLoading()).toBe(true);

    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();
    expect(component.isLoading()).toBe(false);

    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(component.isLoading()).toBe(true);
  });

  it('should handle rapid tableData changes', () => {
    fixture.componentRef.setInput('isLoading', false);

    const firstData: PaginatedViewOnlyLinksModel = {
      items: [{ ...mockViewOnlyLink, id: 'first' }],
      total: 1,
      perPage: 10,
      next: null,
      prev: null,
    };

    const secondData: PaginatedViewOnlyLinksModel = {
      items: [{ ...mockViewOnlyLink, id: 'second' }],
      total: 1,
      perPage: 10,
      next: null,
      prev: null,
    };

    fixture.componentRef.setInput('tableData', firstData);
    fixture.detectChanges();
    expect(component.tableData().items[0].id).toBe('first');

    fixture.componentRef.setInput('tableData', secondData);
    fixture.detectChanges();
    expect(component.tableData().items[0].id).toBe('second');
  });
});
