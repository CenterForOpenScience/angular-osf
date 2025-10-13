import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsState } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { AffiliatedInstitutionSelectComponent } from '@shared/components';
import { Institution } from '@shared/models';
import { InstitutionsSelectors } from '@shared/stores/institutions';

import { PreprintsAffiliatedInstitutionsComponent } from './preprints-affiliated-institutions.component';

import { MOCK_INSTITUTION } from '@testing/mocks';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintsAffiliatedInstitutionsComponent', () => {
  let component: PreprintsAffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<PreprintsAffiliatedInstitutionsComponent>;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint: any = { id: 'preprint-1', reviewsState: ReviewsState.Pending };
  const mockUserInstitutions: Institution[] = [MOCK_INSTITUTION];
  const mockResourceInstitutions: Institution[] = [MOCK_INSTITUTION];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PreprintsAffiliatedInstitutionsComponent,
        OSFTestingModule,
        MockComponent(AffiliatedInstitutionSelectComponent),
      ],
      providers: [
        provideMockStore({
          signals: [
            {
              selector: InstitutionsSelectors.getUserInstitutions,
              value: mockUserInstitutions,
            },
            {
              selector: InstitutionsSelectors.areUserInstitutionsLoading,
              value: false,
            },
            {
              selector: InstitutionsSelectors.getResourceInstitutions,
              value: mockResourceInstitutions,
            },
            {
              selector: InstitutionsSelectors.areResourceInstitutionsLoading,
              value: false,
            },
            {
              selector: InstitutionsSelectors.areResourceInstitutionsSubmitting,
              value: false,
            },
            {
              selector: PreprintStepperSelectors.getInstitutionsChanged,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsAffiliatedInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', mockProvider);
    fixture.componentRef.setInput('preprint', mockPreprint);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct values', () => {
    expect(component.provider()).toBe(mockProvider);
    expect(component.preprint()!.id).toBe('preprint-1');
    expect(component.userInstitutions()).toBe(mockUserInstitutions);
    expect(component.areUserInstitutionsLoading()).toBe(false);
    expect(component.resourceInstitutions()).toBe(mockResourceInstitutions);
    expect(component.areResourceInstitutionsLoading()).toBe(false);
    expect(component.areResourceInstitutionsSubmitting()).toBe(false);
  });

  it('should initialize selectedInstitutions with resource institutions', () => {
    expect(component.selectedInstitutions()).toEqual(mockResourceInstitutions);
  });

  it('should handle institutions change', () => {
    const newInstitutions = [MOCK_INSTITUTION];

    component.onInstitutionsChange(newInstitutions);

    expect(component.selectedInstitutions()).toEqual(newInstitutions);
  });

  it('should handle effect for resource institutions', () => {
    const newResourceInstitutions = [MOCK_INSTITUTION];

    jest.spyOn(component, 'resourceInstitutions').mockReturnValue(newResourceInstitutions);
    component.ngOnInit();

    expect(component.selectedInstitutions()).toEqual(newResourceInstitutions);
  });

  it('should not update selectedInstitutions when resource institutions is empty', () => {
    const initialInstitutions = component.selectedInstitutions();

    jest.spyOn(component, 'resourceInstitutions').mockReturnValue([]);
    component.ngOnInit();

    expect(component.selectedInstitutions()).toEqual(initialInstitutions);
  });

  it('should handle multiple institution changes', () => {
    const firstChange = [MOCK_INSTITUTION];
    const secondChange = [MOCK_INSTITUTION];

    component.onInstitutionsChange(firstChange);
    expect(component.selectedInstitutions()).toEqual(firstChange);

    component.onInstitutionsChange(secondChange);
    expect(component.selectedInstitutions()).toEqual(secondChange);
  });
});
