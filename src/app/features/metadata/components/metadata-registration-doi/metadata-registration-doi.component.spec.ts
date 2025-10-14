import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Identifier } from '@osf/shared/models';

import { MetadataRegistrationDoiComponent } from './metadata-registration-doi.component';

import { MOCK_PROJECT_IDENTIFIERS } from '@testing/mocks';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('MetadataRegistrationDoiComponent', () => {
  let component: MetadataRegistrationDoiComponent;
  let fixture: ComponentFixture<MetadataRegistrationDoiComponent>;

  const mockIdentifiers: Identifier[] = [MOCK_PROJECT_IDENTIFIERS];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataRegistrationDoiComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataRegistrationDoiComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.identifiers()).toEqual([]);
    expect(component.doiHost).toBe('https://doi.org/');
  });

  it('should set identifiers input', () => {
    fixture.componentRef.setInput('identifiers', mockIdentifiers);
    fixture.detectChanges();

    expect(component.identifiers()).toEqual(mockIdentifiers);
  });

  it('should compute registrationDoi correctly with identifiers', () => {
    fixture.componentRef.setInput('identifiers', mockIdentifiers);
    fixture.detectChanges();

    const expectedDoi = component.doiHost + mockIdentifiers[0].value;
    expect(component.registrationDoi()).toBe(expectedDoi);
  });

  it('should compute registrationDoi as empty string when identifiers is undefined', () => {
    fixture.componentRef.setInput('identifiers', undefined);
    fixture.detectChanges();

    expect(component.registrationDoi()).toBe('');
  });

  it('should render DOI link in template', () => {
    fixture.componentRef.setInput('identifiers', mockIdentifiers);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const linkElement = compiled.querySelector('a');
    expect(linkElement).toBeTruthy();
    expect(linkElement.getAttribute('href')).toBe(component.registrationDoi());
    expect(linkElement.getAttribute('target')).toBe('_blank');
  });

  it('should display translated label', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const heading = compiled.querySelector('h2');
    expect(heading).toBeTruthy();
  });

  it('should use correct DOI host', () => {
    expect(component.doiHost).toBe('https://doi.org/');
  });
});
