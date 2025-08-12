import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@shared/mocks';

import { DataResourcesComponent } from './data-resources.component';

describe('DataResourcesComponent', () => {
  let component: DataResourcesComponent;
  let fixture: ComponentFixture<DataResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataResourcesComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(DataResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.vertical()).toBe(false);
    expect(component.resourceId()).toBeUndefined();
    expect(component.hasData()).toBeUndefined();
    expect(component.hasAnalyticCode()).toBeUndefined();
    expect(component.hasMaterials()).toBeUndefined();
    expect(component.hasPapers()).toBeUndefined();
    expect(component.hasSupplements()).toBeUndefined();
  });

  it('should accept vertical input', () => {
    fixture.componentRef.setInput('vertical', true);
    fixture.detectChanges();

    expect(component.vertical()).toBe(true);
  });

  it('should accept resourceId input', () => {
    const testId = 'test-id-1';
    fixture.componentRef.setInput('resourceId', testId);
    fixture.detectChanges();

    expect(component.resourceId()).toBe(testId);
  });

  it('should accept hasData input', () => {
    fixture.componentRef.setInput('hasData', true);
    fixture.detectChanges();

    expect(component.hasData()).toBe(true);
  });

  it('should accept hasAnalyticCode input', () => {
    fixture.componentRef.setInput('hasAnalyticCode', true);
    fixture.detectChanges();

    expect(component.hasAnalyticCode()).toBe(true);
  });

  it('should accept hasMaterials input', () => {
    fixture.componentRef.setInput('hasMaterials', true);
    fixture.detectChanges();

    expect(component.hasMaterials()).toBe(true);
  });

  it('should accept hasPapers input', () => {
    fixture.componentRef.setInput('hasPapers', true);
    fixture.detectChanges();

    expect(component.hasPapers()).toBe(true);
  });

  it('should accept hasSupplements input', () => {
    fixture.componentRef.setInput('hasSupplements', true);
    fixture.detectChanges();

    expect(component.hasSupplements()).toBe(true);
  });

  it('should return correct link with resourceId', () => {
    const testId = 'test-resource-id1';
    fixture.componentRef.setInput('resourceId', testId);
    fixture.detectChanges();

    const result = component.getResourceLink();

    expect(result).toBe('/registries/test-resource-id1/resources');
  });

  it('should return correct link with numeric resourceId', () => {
    const testId = '12345';
    fixture.componentRef.setInput('resourceId', testId);
    fixture.detectChanges();

    const result = component.getResourceLink();

    expect(result).toBe('/registries/12345/resources');
  });

  it('should return correct link with empty resourceId', () => {
    fixture.componentRef.setInput('resourceId', '');
    fixture.detectChanges();

    const result = component.getResourceLink();

    expect(result).toBe('/registries//resources');
  });

  it('should return correct link with undefined resourceId', () => {
    fixture.componentRef.setInput('resourceId', undefined);
    fixture.detectChanges();

    const result = component.getResourceLink();

    expect(result).toBe('/registries/undefined/resources');
  });

  it('should handle input updates', () => {
    fixture.componentRef.setInput('resourceId', 'initial-id');
    fixture.componentRef.setInput('hasData', false);
    fixture.detectChanges();

    expect(component.resourceId()).toBe('initial-id');
    expect(component.hasData()).toBe(false);

    fixture.componentRef.setInput('resourceId', 'updated-id');
    fixture.componentRef.setInput('hasData', true);
    fixture.detectChanges();

    expect(component.resourceId()).toBe('updated-id');
    expect(component.hasData()).toBe(true);
  });
});
