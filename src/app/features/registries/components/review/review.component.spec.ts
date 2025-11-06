import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';
import { FieldType } from '@osf/shared/enums/field-type.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ContributorsSelectors } from '@osf/shared/stores/contributors';
import { SubjectsSelectors } from '@osf/shared/stores/subjects';

import { ReviewComponent } from './review.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockDialog: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let mockConfirm: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  let mockToast: ReturnType<ToastServiceMockBuilder['build']>;

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().withUrl('/registries/123/review').build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build();

    mockDialog = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    mockConfirm = CustomConfirmationServiceMockBuilder.create()
      .withConfirmDelete(jest.fn((opts) => opts.onConfirm && opts.onConfirm()))
      .build();
    mockToast = ToastServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        ReviewComponent,
        OSFTestingModule,
        ...MockComponents(RegistrationBlocksDataComponent, ContributorsListComponent, LicenseDisplayComponent),
      ],
      providers: [
        MockProvider(Router, mockRouter),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(CustomDialogService, mockDialog),
        MockProvider(CustomConfirmationService, mockConfirm),
        MockProvider(ToastService, mockToast),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getPagesSchema, value: [] },
            {
              selector: RegistriesSelectors.getDraftRegistration,
              value: { id: 'draft-1', providerId: 'prov-1', currentUserPermissions: [], hasProject: false },
            },
            { selector: RegistriesSelectors.isDraftSubmitting, value: false },
            { selector: RegistriesSelectors.isDraftLoading, value: false },
            { selector: RegistriesSelectors.getStepsData, value: {} },
            { selector: RegistriesSelectors.getRegistrationComponents, value: [] },
            { selector: RegistriesSelectors.getRegistrationLicense, value: null },
            { selector: RegistriesSelectors.getRegistration, value: { id: 'new-reg-1' } },
            { selector: RegistriesSelectors.getStepsState, value: { 0: { invalid: false } } },
            { selector: ContributorsSelectors.getContributors, value: [] },
            { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
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
    expect(component.FieldType).toBe(FieldType);
  });

  it('should navigate back to previous step', () => {
    const navSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    component.goBack();
    expect(navSpy).toHaveBeenCalledWith(['../', 0], { relativeTo: TestBed.inject(ActivatedRoute) });
  });

  it('should open confirmation dialog when deleting draft and navigate on confirm', () => {
    const navSpy = jest.spyOn(TestBed.inject(Router), 'navigateByUrl');
    (component as any).actions = {
      ...component.actions,
      deleteDraft: jest.fn().mockReturnValue(of({})),
      clearState: jest.fn(),
    };

    component.deleteDraft();

    expect(mockConfirm.confirmDelete).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith('/registries/prov-1/new');
  });

  it('should open select components dialog when components exist and chain to confirm', () => {
    (component as any).components = () => ['c1', 'c2'];
    (mockDialog.open as jest.Mock).mockReturnValueOnce({ onClose: of(['c1']) } as any);
    component.confirmRegistration();

    expect(mockDialog.open).toHaveBeenCalled();
    expect((mockDialog.open as jest.Mock).mock.calls.length).toBeGreaterThan(1);
  });
});
