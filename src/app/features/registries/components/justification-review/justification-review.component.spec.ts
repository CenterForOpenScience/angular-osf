import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SchemaActionTrigger } from '@osf/features/registries/enums';
import { RegistriesSelectors } from '@osf/features/registries/store';
import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { JustificationReviewComponent } from './justification-review.component';

import { MOCK_PAGES_SCHEMA } from '@testing/mocks/registries.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('JustificationReviewComponent', () => {
  let component: JustificationReviewComponent;
  let fixture: ComponentFixture<JustificationReviewComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let mockCustomConfirmationService: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  let mockToastService: ReturnType<ToastServiceMockBuilder['build']>;

  const MOCK_SCHEMA_RESPONSE = {
    id: 'rev-1',
    registrationId: 'reg-1',
    reviewsState: RevisionReviewStates.RevisionInProgress,
    updatedResponseKeys: ['field1'],
  } as any;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'rev-1' }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/x').build();
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    mockCustomConfirmationService = CustomConfirmationServiceMockBuilder.create().build();
    mockToastService = ToastServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [JustificationReviewComponent, OSFTestingModule, MockComponent(RegistrationBlocksDataComponent)],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(CustomConfirmationService, mockCustomConfirmationService),
        MockProvider(ToastService, mockToastService),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getPagesSchema, value: MOCK_PAGES_SCHEMA },
            { selector: RegistriesSelectors.getSchemaResponse, value: MOCK_SCHEMA_RESPONSE },
            { selector: RegistriesSelectors.getSchemaResponseRevisionData, value: {} },
            { selector: RegistriesSelectors.getUpdatedFields, value: {} },
            { selector: RegistriesSelectors.getSchemaResponseLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JustificationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute changes from pages and updated fields', () => {
    expect(component.changes().length).toBeGreaterThan(0);
  });

  it('should navigate back to previous step', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should submit revision for review', () => {
    const mockActions = {
      handleSchemaResponse: jest.fn().mockReturnValue(of({})),
    } as any;
    Object.defineProperty(component, 'actions', { value: mockActions });

    component.submit();

    expect(mockActions.handleSchemaResponse).toHaveBeenCalledWith('rev-1', SchemaActionTrigger.Submit);
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('registries.justification.successSubmit');
  });

  it('should accept changes', () => {
    const mockActions = {
      handleSchemaResponse: jest.fn().mockReturnValue(of({})),
    } as any;
    Object.defineProperty(component, 'actions', { value: mockActions });

    component.acceptChanges();

    expect(mockActions.handleSchemaResponse).toHaveBeenCalledWith('rev-1', SchemaActionTrigger.Approve);
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('registries.justification.successAccept');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/reg-1/overview');
  });

  it('should continue editing and show decision recorded toast when confirmed', () => {
    jest.spyOn(mockCustomDialogService, 'open').mockReturnValue({ onClose: of(true) } as any);

    component.continueEditing();

    expect(mockCustomDialogService.open).toHaveBeenCalled();
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('registries.justification.decisionRecorded');
  });

  it('should delete draft update after confirmation', () => {
    const mockActions = {
      deleteSchemaResponse: jest.fn().mockReturnValue(of({})),
      clearState: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: mockActions });

    component.deleteDraftUpdate();
    expect(mockCustomConfirmationService.confirmDelete).toHaveBeenCalled();
    const call = (mockCustomConfirmationService.confirmDelete as any).mock.calls[0][0];
    call.onConfirm();

    expect(mockActions.deleteSchemaResponse).toHaveBeenCalledWith('rev-1');
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('registries.justification.successDeleteDraft');
    expect(mockActions.clearState).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/reg-1/overview');
  });
});
