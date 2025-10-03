import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryServicesComponent } from './registry-services.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RegistryServicesComponent', () => {
  let component: RegistryServicesComponent;
  let fixture: ComponentFixture<RegistryServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryServicesComponent, OSFTestingModule],
    }).compileComponents();

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

  it('should open email via mailto when openEmail is called', () => {
    const originalHref = window.location.href;
    Object.defineProperty(window, 'location', {
      value: { href: originalHref },
      writable: true,
      configurable: true,
    });

    component.openEmail();

    expect(window.location.href).toBe('mailto:contact@osf.io');
  });
});
