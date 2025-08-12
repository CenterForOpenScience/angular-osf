import { PaginatorState } from 'primeng/paginator';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPaginatorComponent } from './custom-paginator.component';

describe('CustomPaginatorComponent', () => {
  let component: CustomPaginatorComponent;
  let fixture: ComponentFixture<CustomPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPaginatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.first()).toBe(0);
    expect(component.rows()).toBe(10);
    expect(component.totalCount()).toBe(0);
    expect(component.showFirstLastIcon()).toBe(false);
  });

  it('should accept first input', () => {
    fixture.componentRef.setInput('first', 20);
    fixture.detectChanges();

    expect(component.first()).toBe(20);
  });

  it('should accept rows input', () => {
    fixture.componentRef.setInput('rows', 25);
    fixture.detectChanges();

    expect(component.rows()).toBe(25);
  });

  it('should accept totalCount input', () => {
    fixture.componentRef.setInput('totalCount', 100);
    fixture.detectChanges();

    expect(component.totalCount()).toBe(100);
  });

  it('should accept showFirstLastIcon input', () => {
    fixture.componentRef.setInput('showFirstLastIcon', true);
    fixture.detectChanges();

    expect(component.showFirstLastIcon()).toBe(true);
  });

  it('should emit pageChanged event', () => {
    const pageChangedSpy = jest.spyOn(component.pageChanged, 'emit');
    const mockPaginatorState: PaginatorState = {
      first: 10,
      rows: 10,
      page: 1,
      pageCount: 5,
    };

    component.pageChanged.emit(mockPaginatorState);

    expect(pageChangedSpy).toHaveBeenCalledWith(mockPaginatorState);
  });

  it('should handle all inputs together', () => {
    fixture.componentRef.setInput('first', 30);
    fixture.componentRef.setInput('rows', 15);
    fixture.componentRef.setInput('totalCount', 150);
    fixture.componentRef.setInput('showFirstLastIcon', true);
    fixture.detectChanges();

    expect(component.first()).toBe(30);
    expect(component.rows()).toBe(15);
    expect(component.totalCount()).toBe(150);
    expect(component.showFirstLastIcon()).toBe(true);
  });

  it('should handle input updates', () => {
    fixture.componentRef.setInput('first', 0);
    fixture.componentRef.setInput('totalCount', 50);
    fixture.detectChanges();

    expect(component.first()).toBe(0);
    expect(component.totalCount()).toBe(50);

    fixture.componentRef.setInput('first', 20);
    fixture.componentRef.setInput('totalCount', 100);
    fixture.detectChanges();

    expect(component.first()).toBe(20);
    expect(component.totalCount()).toBe(100);
  });
});
