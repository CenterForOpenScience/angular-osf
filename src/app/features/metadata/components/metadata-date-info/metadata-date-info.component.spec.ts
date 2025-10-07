import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataDateInfoComponent } from './metadata-date-info.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('MetadataDateInfoComponent', () => {
  let component: MetadataDateInfoComponent;
  let fixture: ComponentFixture<MetadataDateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataDateInfoComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataDateInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.dateCreated()).toBe('');
    expect(component.dateModified()).toBe('');
    expect(component.dateFormat).toBe('MMM d, y, h:mm a');
  });

  it('should set dateCreated input', () => {
    const mockDate = '2024-01-15T10:30:00Z';
    fixture.componentRef.setInput('dateCreated', mockDate);
    fixture.detectChanges();

    expect(component.dateCreated()).toBe(mockDate);
  });

  it('should set dateModified input', () => {
    const mockDate = '2024-01-20T14:45:00Z';
    fixture.componentRef.setInput('dateModified', mockDate);
    fixture.detectChanges();

    expect(component.dateModified()).toBe(mockDate);
  });

  it('should handle undefined dateCreated input', () => {
    fixture.componentRef.setInput('dateCreated', undefined);
    fixture.detectChanges();

    expect(component.dateCreated()).toBeUndefined();
  });

  it('should handle undefined dateModified input', () => {
    fixture.componentRef.setInput('dateModified', undefined);
    fixture.detectChanges();

    expect(component.dateModified()).toBeUndefined();
  });

  it('should render dateCreated in template', () => {
    const mockDate = '2024-01-15T10:30:00Z';
    fixture.componentRef.setInput('dateCreated', mockDate);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dateCreatedElement = compiled.querySelector('p');
    expect(dateCreatedElement).toBeTruthy();
  });

  it('should render dateModified in template', () => {
    const mockDate = '2024-01-20T14:45:00Z';
    fixture.componentRef.setInput('dateModified', mockDate);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dateElements = compiled.querySelectorAll('p');
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('should display translated labels', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const headings = compiled.querySelectorAll('h2');
    expect(headings.length).toBe(2);
  });

  it('should handle empty date strings', () => {
    fixture.componentRef.setInput('dateCreated', '');
    fixture.componentRef.setInput('dateModified', '');
    fixture.detectChanges();

    expect(component.dateCreated()).toBe('');
    expect(component.dateModified()).toBe('');
  });

  it('should use correct date format', () => {
    expect(component.dateFormat).toBe('MMM d, y, h:mm a');
  });
});
