import { Store } from '@ngxs/store';

import { MockProvider, MockProviders } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE, TranslateServiceMock } from '@osf/shared/mocks';
import { InstitutionsSelectors } from '@osf/shared/stores';

import { AffiliatedInstitutionsDialogComponent } from './affiliated-institutions-dialog.component';

describe('AffiliatedInstitutionsDialogComponent', () => {
  let component: AffiliatedInstitutionsDialogComponent;
  let fixture: ComponentFixture<AffiliatedInstitutionsDialogComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === InstitutionsSelectors.getUserInstitutions) return () => [];
      if (selector === InstitutionsSelectors.areUserInstitutionsLoading) return () => false;
      return () => [];
    });
    await TestBed.configureTestingModule({
      imports: [AffiliatedInstitutionsDialogComponent],
      providers: [
        TranslateServiceMock,
        MockProviders(DynamicDialogRef, DynamicDialogConfig),
        MockProvider(Store, MOCK_STORE),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliatedInstitutionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
