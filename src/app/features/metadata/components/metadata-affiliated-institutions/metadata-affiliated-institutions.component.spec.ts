import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components';
import { MOCK_PROJECT_AFFILIATED_INSTITUTIONS, TranslateServiceMock } from '@osf/shared/mocks';

import { MetadataAffiliatedInstitutionsComponent } from './metadata-affiliated-institutions.component';

describe('MetadataAffiliatedInstitutionsComponent', () => {
  let component: MetadataAffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<MetadataAffiliatedInstitutionsComponent>;

  const mockAffiliatedInstitutions = MOCK_PROJECT_AFFILIATED_INSTITUTIONS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataAffiliatedInstitutionsComponent, MockComponent(AffiliatedInstitutionsViewComponent)],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataAffiliatedInstitutionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set affiliatedInstitutions input', () => {
    fixture.componentRef.setInput('affiliatedInstitutions', mockAffiliatedInstitutions);
    fixture.detectChanges();

    expect(component.affiliatedInstitutions()).toEqual(mockAffiliatedInstitutions);
  });

  it('should set readonly input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
  });
});
