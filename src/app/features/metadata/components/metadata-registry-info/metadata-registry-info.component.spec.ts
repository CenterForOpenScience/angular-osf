import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryProviderDetails } from '@osf/shared/models/provider/registry-provider.model';

import { MetadataRegistryInfoComponent } from './metadata-registry-info.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('MetadataRegistryInfoComponent', () => {
  let component: MetadataRegistryInfoComponent;
  let fixture: ComponentFixture<MetadataRegistryInfoComponent>;

  const mockProvider: RegistryProviderDetails = {
    id: 'test-provider-id',
    name: 'Test Registry Provider',
    descriptionHtml: '<p>Test description</p>',
    permissions: [],
    brand: null,
    iri: 'https://example.com/registry',
    reviewsWorkflow: 'standard',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataRegistryInfoComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataRegistryInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.type()).toBe('');
    expect(component.provider()).toBeUndefined();
  });

  it('should set type input', () => {
    const mockType = 'Clinical Trial';
    fixture.componentRef.setInput('type', mockType);
    fixture.detectChanges();

    expect(component.type()).toBe(mockType);
  });

  it('should set provider input', () => {
    fixture.componentRef.setInput('provider', mockProvider);
    fixture.detectChanges();

    expect(component.provider()).toEqual(mockProvider);
  });

  it('should handle undefined type input', () => {
    fixture.componentRef.setInput('type', undefined);
    fixture.detectChanges();

    expect(component.type()).toBeUndefined();
  });

  it('should handle null provider input', () => {
    fixture.componentRef.setInput('provider', null);
    fixture.detectChanges();

    expect(component.provider()).toBeNull();
  });

  it('should render type in template', () => {
    const mockType = 'Preprint';
    fixture.componentRef.setInput('type', mockType);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const typeElement = compiled.querySelector('[data-test-display-registry-type]');
    expect(typeElement).toBeTruthy();
    expect(typeElement.textContent.trim()).toBe(mockType);
  });

  it('should render provider name in template', () => {
    fixture.componentRef.setInput('provider', mockProvider);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const providerElement = compiled.querySelector('[data-test-display-registry-provider]');
    expect(providerElement).toBeTruthy();
    expect(providerElement.textContent.trim()).toBe(mockProvider.name);
  });

  it('should display empty string when type is empty', () => {
    fixture.componentRef.setInput('type', '');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const typeElement = compiled.querySelector('[data-test-display-registry-type]');
    expect(typeElement.textContent.trim()).toBe('');
  });

  it('should display empty string when provider is null', () => {
    fixture.componentRef.setInput('provider', null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const providerElement = compiled.querySelector('[data-test-display-registry-provider]');
    expect(providerElement.textContent.trim()).toBe('');
  });

  it('should display both type and provider when both are set', () => {
    const mockType = 'Registered Report';
    fixture.componentRef.setInput('type', mockType);
    fixture.componentRef.setInput('provider', mockProvider);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const typeElement = compiled.querySelector('[data-test-display-registry-type]');
    const providerElement = compiled.querySelector('[data-test-display-registry-provider]');

    expect(typeElement.textContent.trim()).toBe(mockType);
    expect(providerElement.textContent.trim()).toBe(mockProvider.name);
  });

  it('should display translated labels', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const headings = compiled.querySelectorAll('h2');
    expect(headings.length).toBe(2);
  });
});
