import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_INSTITUTION } from '@shared/mocks';
import { Institution } from '@shared/models';

import { AffiliatedInstitutionsViewComponent } from './affiliated-institutions-view.component';

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

  it('should have default true for showTitle', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.detectChanges();

    expect(component.showTitle()).toBe(true);
  });

  it('should accept showTitle input as true', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('showTitle', true);
    fixture.detectChanges();

    expect(component.showTitle()).toBe(true);
  });

  it('should accept showTitle input as false', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('showTitle', false);
    fixture.detectChanges();

    expect(component.showTitle()).toBe(false);
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

  it('should update when showTitle input changes', () => {
    fixture.componentRef.setInput('institutions', mockInstitutions);
    fixture.componentRef.setInput('showTitle', true);
    fixture.detectChanges();

    expect(component.showTitle()).toBe(true);

    fixture.componentRef.setInput('showTitle', false);
    fixture.detectChanges();

    expect(component.showTitle()).toBe(false);
  });
});
