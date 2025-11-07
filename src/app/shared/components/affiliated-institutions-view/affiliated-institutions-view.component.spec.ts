import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Institution } from '@shared/models/institutions/institutions.models';

import { AffiliatedInstitutionsViewComponent } from './affiliated-institutions-view.component';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('AffiliatedInstitutionsViewComponent', () => {
  let component: AffiliatedInstitutionsViewComponent;
  let fixture: ComponentFixture<AffiliatedInstitutionsViewComponent>;

  const mockInstitutions: Institution[] = [MOCK_INSTITUTION];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliatedInstitutionsViewComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliatedInstitutionsViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept institutions as required input', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.detectChanges();

    expect(component.institutions()).toEqual(mockInstitutions);
  });

  it('should accept empty institutions array', () => {
    fixture.componentRef.setInput('institutions', []);
    fixture.detectChanges();

    expect(component.institutions()).toEqual([]);
  });

  it('should accept multiple institutions', () => {
    const multipleInstitutions: Institution[] = [
      MOCK_INSTITUTION,
      { ...MOCK_INSTITUTION, id: 'inst-2', name: 'Institution 2' },
      { ...MOCK_INSTITUTION, id: 'inst-3', name: 'Institution 3' },
    ];

    fixture.componentRef.setInput('institutions', multipleInstitutions);
    fixture.detectChanges();

    expect(component.institutions()).toEqual(multipleInstitutions);
    expect(component.institutions().length).toBe(3);
  });

  it('should have default false for isLoading', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
  });

  it('should accept isLoading input as true', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
  });

  it('should accept isLoading input as false', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
  });

  it('should update when institutions input changes', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.detectChanges();

    expect(component.institutions()).toEqual(mockInstitutions);

    const updatedInstitutions: Institution[] = [
      { ...MOCK_INSTITUTION, id: 'updated-inst', name: 'Updated Institution' },
    ];

    fixture.componentRef.setInput('institutions', updatedInstitutions);
    fixture.detectChanges();

    expect(component.institutions()).toEqual(updatedInstitutions);
    expect(component.institutions()[0].name).toBe('Updated Institution');
  });

  it('should update when isLoading input changes', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);

    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
  });
});
