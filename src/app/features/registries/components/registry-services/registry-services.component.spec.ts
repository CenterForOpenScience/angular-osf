import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { RegistryServicesComponent } from './registry-services.component';

describe('RegistryServicesComponent', () => {
  let component: RegistryServicesComponent;
  let fixture: ComponentFixture<RegistryServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegistryServicesComponent],
      providers: [provideOSFCore(), provideRouter([])],
    });

    fixture = TestBed.createComponent(RegistryServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose registryServices', () => {
    expect(Array.isArray(component.registryServices)).toBe(true);
    expect(component.registryServices.length).toBeGreaterThan(0);
  });

  it('should render service items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button, a');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render contact mailto anchor', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const mailtoAnchor = compiled.querySelector('a[href="mailto:contact@osf.io"]');

    expect(mailtoAnchor).toBeTruthy();
  });
});
