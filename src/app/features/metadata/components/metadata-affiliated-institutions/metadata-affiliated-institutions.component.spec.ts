import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components';

import { MetadataAffiliatedInstitutionsComponent } from './metadata-affiliated-institutions.component';

import { MOCK_PROJECT_AFFILIATED_INSTITUTIONS } from '@testing/mocks';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('MetadataAffiliatedInstitutionsComponent', () => {
  let component: MetadataAffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<MetadataAffiliatedInstitutionsComponent>;

  const mockAffiliatedInstitutions = MOCK_PROJECT_AFFILIATED_INSTITUTIONS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MetadataAffiliatedInstitutionsComponent,
        MockComponent(AffiliatedInstitutionsViewComponent),
        OSFTestingModule,
      ],
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
