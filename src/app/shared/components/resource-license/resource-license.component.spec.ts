import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ResourceLicenseComponent } from './resource-license.component';

import { MOCK_LICENSE } from '@testing/mocks/license.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ResourceLicenseComponent', () => {
  let component: ResourceLicenseComponent;
  let fixture: ComponentFixture<ResourceLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceLicenseComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceLicenseComponent);
    component = fixture.componentInstance;
  });

  it('should have default input values', () => {
    expect(component.license()).toBeUndefined();
    expect(component.isLoading()).toBe(false);
  });

  it('should set license input correctly with LicenseModel', () => {
    fixture.componentRef.setInput('license', MOCK_LICENSE);
    expect(component.license()).toEqual(MOCK_LICENSE);
  });

  it('should set license input correctly with null value', () => {
    fixture.componentRef.setInput('license', null);
    expect(component.license()).toBeNull();
  });

  it('should set license input correctly with undefined value', () => {
    fixture.componentRef.setInput('license', undefined);
    expect(component.license()).toBeUndefined();
  });

  it('should set isLoading input correctly', () => {
    fixture.componentRef.setInput('isLoading', true);
    expect(component.isLoading()).toBe(true);
  });

  it('should display license name when license is provided and isLoading is false', () => {
    fixture.componentRef.setInput('license', MOCK_LICENSE);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const divElement = fixture.debugElement.query(By.css('div'));
    expect(divElement).toBeTruthy();
    expect(divElement.nativeElement.textContent.trim()).toBe('Apache License, 2.0');
  });
});
