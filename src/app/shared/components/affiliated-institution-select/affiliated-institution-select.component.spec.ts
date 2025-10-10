import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_INSTITUTION } from '@shared/mocks';
import { Institution } from '@shared/models';

import { AffiliatedInstitutionSelectComponent } from './affiliated-institution-select.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('AffiliatedInstitutionSelectComponent', () => {
  let component: AffiliatedInstitutionSelectComponent;
  let fixture: ComponentFixture<AffiliatedInstitutionSelectComponent>;

  const mockInstitutions: Institution[] = [MOCK_INSTITUTION];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliatedInstitutionSelectComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliatedInstitutionSelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should return true when institutions array is empty', () => {
    fixture.componentRef.setInput('institutions', []);
    fixture.componentRef.setInput('selectedInstitutions', []);
    fixture.detectChanges();

    expect(component.isSelectAllDisabled()).toBe(true);
  });

  it('should return true when all institutions are already selected', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('selectedInstitutions', [...mockInstitutions]);
    fixture.detectChanges();

    expect(component.isSelectAllDisabled()).toBe(true);
  });

  it('should return false when no institutions are selected', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('selectedInstitutions', []);
    fixture.detectChanges();

    expect(component.isSelectAllDisabled()).toBe(false);
  });

  it('should ignore institutions that are not in the available list', () => {
    const unavailableInstitution: Institution = {
      id: 'inst-unavailable',
      type: 'institutions',
      name: 'Unavailable Institution',
      description: 'Description',
      iri: 'https://iri-unavailable.edu',
      rorIri: null,
      iris: ['https://iri-unavailable.edu'],
      assets: {
        logo: 'logo.png',
        logo_rounded: 'logo-rounded.png',
        banner: 'banner.png',
      },
      institutionalRequestAccessEnabled: false,
      logoPath: '/logos/unavailable.png',
    };

    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('selectedInstitutions', [...mockInstitutions, unavailableInstitution]);
    fixture.detectChanges();

    expect(component.isSelectAllDisabled()).toBe(true);
  });

  it('should return true when no institutions are selected', () => {
    fixture.componentRef.setInput('selectedInstitutions', []);
    fixture.detectChanges();

    expect(component.isRemoveAllDisabled()).toBe(true);
  });

  it('should return false when some institutions are selected', () => {
    fixture.componentRef.setInput('selectedInstitutions', [mockInstitutions[0]]);
    fixture.detectChanges();

    expect(component.isRemoveAllDisabled()).toBe(false);
  });

  it('should return false when all institutions are selected', () => {
    fixture.componentRef.setInput('selectedInstitutions', [...mockInstitutions]);
    fixture.detectChanges();

    expect(component.isRemoveAllDisabled()).toBe(false);
  });

  it('should select all available institutions', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('selectedInstitutions', []);
    fixture.detectChanges();

    component.selectAll();

    expect(component.selectedInstitutions()).toEqual(mockInstitutions);
  });

  it('should add missing institutions to already selected ones', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('selectedInstitutions', [mockInstitutions[0]]);
    fixture.detectChanges();

    component.selectAll();

    expect(component.selectedInstitutions()).toEqual(mockInstitutions);
  });

  it('should preserve institutions that are not in the available list', () => {
    const unavailableInstitution: Institution = {
      id: 'inst-unavailable',
      type: 'institutions',
      name: 'Unavailable Institution',
      description: 'Description',
      iri: 'https://iri-unavailable.edu',
      rorIri: null,
      iris: ['https://iri-unavailable.edu'],
      assets: {
        logo: 'logo.png',
        logo_rounded: 'logo-rounded.png',
        banner: 'banner.png',
      },
      institutionalRequestAccessEnabled: false,
      logoPath: '/logos/unavailable.png',
    };

    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('selectedInstitutions', [unavailableInstitution]);
    fixture.detectChanges();

    component.selectAll();

    expect(component.selectedInstitutions()).toEqual([...mockInstitutions, unavailableInstitution]);
  });

  it('should work correctly when called with already all selected', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('selectedInstitutions', [...mockInstitutions]);
    fixture.detectChanges();

    component.selectAll();

    expect(component.selectedInstitutions()).toEqual(mockInstitutions);
  });

  it('should remove all selected institutions', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('selectedInstitutions', [...mockInstitutions]);
    fixture.detectChanges();

    component.removeAll();

    expect(component.selectedInstitutions()).toEqual([]);
  });

  it('should only remove institutions that are in the available list', () => {
    const unavailableInstitution: Institution = {
      id: 'inst-unavailable',
      type: 'institutions',
      name: 'Unavailable Institution',
      description: 'Description',
      iri: 'https://iri-unavailable.edu',
      rorIri: null,
      iris: ['https://iri-unavailable.edu'],
      assets: {
        logo: 'logo.png',
        logo_rounded: 'logo-rounded.png',
        banner: 'banner.png',
      },
      institutionalRequestAccessEnabled: false,
      logoPath: '/logos/unavailable.png',
    };

    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('selectedInstitutions', [...mockInstitutions, unavailableInstitution]);
    fixture.detectChanges();

    component.removeAll();

    expect(component.selectedInstitutions()).toEqual([unavailableInstitution]);
  });

  it('should work correctly when called with no selections', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('selectedInstitutions', []);
    fixture.detectChanges();

    component.removeAll();

    expect(component.selectedInstitutions()).toEqual([]);
  });

  it('should add institution when not selected', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('selectedInstitutions', []);
    fixture.detectChanges();

    component.selectDeselectInstitution(mockInstitutions[0]);

    expect(component.selectedInstitutions()).toContain(mockInstitutions[0]);
    expect(component.selectedInstitutions().length).toBe(1);
  });

  it('should toggle institution multiple times correctly', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('selectedInstitutions', []);
    fixture.detectChanges();

    component.selectDeselectInstitution(mockInstitutions[0]);
    expect(component.selectedInstitutions()).toContain(mockInstitutions[0]);

    component.selectDeselectInstitution(mockInstitutions[0]);
    expect(component.selectedInstitutions()).not.toContain(mockInstitutions[0]);

    component.selectDeselectInstitution(mockInstitutions[0]);
    expect(component.selectedInstitutions()).toContain(mockInstitutions[0]);
  });
});
