import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { DatePipe } from '@angular/common';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellLink } from '@osf/features/admin-institutions/models';
import { CustomPaginatorComponent } from '@shared/components';
import { StopPropagationDirective } from '@shared/directives';

import { AdminTableComponent } from './admin-table.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('AdminTableComponent', () => {
  let component: AdminTableComponent;
  let componentRef: ComponentRef<AdminTableComponent>;
  let fixture: ComponentFixture<AdminTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminTableComponent,
        MockComponent(CustomPaginatorComponent),
        OSFTestingModule,
        MockPipe(DatePipe),
        MockComponent(CustomPaginatorComponent),
        MockDirective(StopPropagationDirective),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTableComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('tableColumns', []);
    componentRef.setInput('tableData', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should identify TableCellLink objects correctly', () => {
    const link: TableCellLink = { text: 'Test', url: '/test' };
    const stringValue = 'test string';
    const numberValue = 123;

    expect(component.isLink(link)).toBe(true);
    expect(component.isLink(stringValue)).toBe(false);
    expect(component.isLink(numberValue)).toBe(false);
    expect(component.isLink(undefined)).toBe(false);
  });

  it('should identify TableCellLink arrays correctly', () => {
    const linkArray: TableCellLink[] = [
      { text: 'Test1', url: '/test1' },
      { text: 'Test2', url: '/test2' },
    ];
    const stringArray = ['test1', 'test2'];
    const emptyArray: any[] = [];

    expect(component.isLinkArray(linkArray)).toBe(true);
    expect(component.isLinkArray(stringArray)).toBe(false);
    expect(component.isLinkArray(emptyArray)).toBe(true);
    expect(component.isLinkArray(undefined)).toBe(false);
  });

  it('should get cell value for TableCellLink', () => {
    const link: TableCellLink = { text: 'Test Link', url: '/test' };
    const result = component.getCellValue(link);

    expect(result).toBe('Test Link');
  });

  it('should compute first link correctly', () => {
    const paginationLinks = {
      first: { href: '/api/users?page=1' },
      prev: { href: '/api/users?page=1' },
      next: { href: '/api/users?page=3' },
    };

    componentRef.setInput('paginationLinks', paginationLinks);
    fixture.detectChanges();

    expect(component.firstLink()).toBe('/api/users?page=1');
  });

  it('should compute prev link correctly', () => {
    const paginationLinks = {
      first: { href: '/api/users?page=1' },
      prev: { href: '/api/users?page=1' },
      next: { href: '/api/users?page=3' },
    };

    componentRef.setInput('paginationLinks', paginationLinks);
    fixture.detectChanges();

    expect(component.prevLink()).toBe('/api/users?page=1');
  });

  it('should compute next link correctly', () => {
    const paginationLinks = {
      first: { href: '/api/users?page=1' },
      prev: { href: '/api/users?page=1' },
      next: { href: '/api/users?page=3' },
    };

    componentRef.setInput('paginationLinks', paginationLinks);
    fixture.detectChanges();

    expect(component.nextLink()).toBe('/api/users?page=3');
  });

  it('should return empty string when pagination links are undefined', () => {
    componentRef.setInput('paginationLinks', undefined);
    fixture.detectChanges();

    expect(component.firstLink()).toBe('');
    expect(component.prevLink()).toBe('');
    expect(component.nextLink()).toBe('');
  });

  it('should have download menu items', () => {
    expect(component.downloadMenuItems).toBeDefined();
    expect(Array.isArray(component.downloadMenuItems)).toBe(true);
  });
});
