import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { CustomConfirmationService, CustomDialogService } from '@osf/shared/services';
import { ContributorsSelectors, SubjectsSelectors } from '@shared/stores';

import { ReviewComponent } from './review.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let mockCustomConfirmationService: ReturnType<CustomConfirmationServiceMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/x').build();
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    mockCustomConfirmationService = CustomConfirmationServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [ReviewComponent, OSFTestingModule],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(CustomDialogService, mockCustomDialogService as any),
        MockProvider(CustomConfirmationService, mockCustomConfirmationService as any),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getPagesSchema, value: [] },
            {
              selector: RegistriesSelectors.getDraftRegistration,
              value: { id: 'draft-1', providerId: 'prov-1', hasProject: false },
            },
            { selector: RegistriesSelectors.isDraftSubmitting, value: false },
            { selector: RegistriesSelectors.isDraftLoading, value: false },
            { selector: RegistriesSelectors.getStepsData, value: {} },
            { selector: ContributorsSelectors.getContributors, value: [] },
            { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
            { selector: RegistriesSelectors.getRegistrationComponents, value: [] },
            { selector: RegistriesSelectors.getRegistrationLicense, value: { options: {} } },
            { selector: RegistriesSelectors.getRegistration, value: { id: 'new-reg-1' } },
            { selector: RegistriesSelectors.getStepsState, value: {} },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open confirm registration dialog when no components', () => {
    (mockCustomDialogService.open as any) = jest.fn().mockReturnValue({ onClose: { subscribe: jest.fn() } });
    component.confirmRegistration();
    expect(mockCustomDialogService.open).toHaveBeenCalled();
  });
});
