import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { DataResourcesComponent } from './data-resources.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';

describe('DataResourcesComponent', () => {
  let component: DataResourcesComponent;
  let fixture: ComponentFixture<DataResourcesComponent>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    activatedRouteMock = ActivatedRouteMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [DataResourcesComponent, OSFTestingModule],
      providers: [MockProvider(ActivatedRoute, activatedRouteMock)],
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
    expect(component.absoluteUrl()).toBeUndefined();
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

  it('should accept absoluteUrl input', () => {
    const testId = 'test-id-1';
    fixture.componentRef.setInput('absoluteUrl', testId);
    fixture.detectChanges();

    expect(component.absoluteUrl()).toBe(testId);
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

  it('should return correct link with absoluteUrl', () => {
    const testId = 'test-resource-id1';
    fixture.componentRef.setInput('absoluteUrl', testId);
    fixture.detectChanges();

    const result = component.resourceUrl();

    expect(result).toBe('test-resource-id1/resources');
  });

  it('should return correct link with numeric absoluteUrl', () => {
    const testId = '12345';
    fixture.componentRef.setInput('absoluteUrl', testId);
    fixture.detectChanges();

    const result = component.resourceUrl();

    expect(result).toBe('12345/resources');
  });

  it('should return correct link with empty absoluteUrl', () => {
    fixture.componentRef.setInput('absoluteUrl', '');
    fixture.detectChanges();

    const result = component.resourceUrl();

    expect(result).toBe('/resources');
  });

  it('should return correct link with undefined absoluteUrl', () => {
    fixture.componentRef.setInput('absoluteUrl', undefined);
    fixture.detectChanges();

    const result = component.resourceUrl();

    expect(result).toBe('undefined/resources');
  });

  it('should handle input updates', () => {
    fixture.componentRef.setInput('absoluteUrl', 'initial-id');
    fixture.componentRef.setInput('hasData', false);
    fixture.detectChanges();

    expect(component.absoluteUrl()).toBe('initial-id');
    expect(component.hasData()).toBe(false);

    fixture.componentRef.setInput('absoluteUrl', 'updated-id');
    fixture.componentRef.setInput('hasData', true);
    fixture.detectChanges();

    expect(component.absoluteUrl()).toBe('updated-id');
    expect(component.hasData()).toBe(true);
  });
});
