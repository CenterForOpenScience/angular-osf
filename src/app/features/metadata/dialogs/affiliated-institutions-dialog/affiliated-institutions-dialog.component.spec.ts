import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components/affiliated-institution-select/affiliated-institution-select.component';
import { Institution } from '@osf/shared/models/institutions/institutions.model';
import { InstitutionsSelectors } from '@osf/shared/stores/institutions';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { AffiliatedInstitutionsDialogComponent } from './affiliated-institutions-dialog.component';

describe('AffiliatedInstitutionsDialogComponent', () => {
  let component: AffiliatedInstitutionsDialogComponent;
  let fixture: ComponentFixture<AffiliatedInstitutionsDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let config: DynamicDialogConfig;

  const mockInstitutions: Institution[] = [MOCK_INSTITUTION];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AffiliatedInstitutionsDialogComponent, MockComponent(AffiliatedInstitutionSelectComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(DynamicDialogConfig),
        provideDynamicDialogRefMock(),
        provideMockStore({
          signals: [
            { selector: InstitutionsSelectors.getUserInstitutions, value: mockInstitutions },
            { selector: InstitutionsSelectors.areUserInstitutionsLoading, value: false },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(AffiliatedInstitutionsDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    config = TestBed.inject(DynamicDialogConfig);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedInstitutions()).toEqual([]);
  });

  it('should initialize with config data if provided', () => {
    const testData = [mockInstitutions[0]];
    config.data = testData;

    fixture = TestBed.createComponent(AffiliatedInstitutionsDialogComponent);
    component = fixture.componentInstance;

    expect(component.selectedInstitutions()).toEqual(testData);
  });

  it('should close dialog with selected institutions on save', () => {
    const selectedInstitutions = [mockInstitutions[0]];
    component.selectedInstitutions.set(selectedInstitutions);

    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith(selectedInstitutions);
  });

  it('should close dialog without data on cancel', () => {
    component.cancel();

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should update selected institutions', () => {
    const newInstitutions = [mockInstitutions[1]];

    component.selectedInstitutions.set(newInstitutions);

    expect(component.selectedInstitutions()).toEqual(newInstitutions);
  });
});
