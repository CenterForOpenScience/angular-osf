import { MockComponent, MockProviders } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components/affiliated-institution-select/affiliated-institution-select.component';
import { InstitutionsSelectors } from '@osf/shared/stores/institutions';
import { Institution } from '@shared/models/institutions/institutions.models';

import { AffiliatedInstitutionsDialogComponent } from './affiliated-institutions-dialog.component';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AffiliatedInstitutionsDialogComponent', () => {
  let component: AffiliatedInstitutionsDialogComponent;
  let fixture: ComponentFixture<AffiliatedInstitutionsDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let config: DynamicDialogConfig;

  const mockInstitutions: Institution[] = [MOCK_INSTITUTION];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AffiliatedInstitutionsDialogComponent,
        OSFTestingModule,
        MockComponent(AffiliatedInstitutionSelectComponent),
      ],
      providers: [
        TranslateServiceMock,
        MockProviders(DynamicDialogRef, DynamicDialogConfig),
        provideMockStore({
          signals: [
            { selector: InstitutionsSelectors.getUserInstitutions, value: mockInstitutions },
            { selector: InstitutionsSelectors.areUserInstitutionsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

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
    const closeSpy = jest.spyOn(dialogRef, 'close');
    const selectedInstitutions = [mockInstitutions[0]];
    component.selectedInstitutions.set(selectedInstitutions);

    component.save();

    expect(closeSpy).toHaveBeenCalledWith(selectedInstitutions);
  });

  it('should close dialog without data on cancel', () => {
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.cancel();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should update selected institutions', () => {
    const newInstitutions = [mockInstitutions[1]];

    component.selectedInstitutions.set(newInstitutions);

    expect(component.selectedInstitutions()).toEqual(newInstitutions);
  });
});
