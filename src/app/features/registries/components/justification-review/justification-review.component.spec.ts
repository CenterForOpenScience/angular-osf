import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SchemaActionTrigger } from '@osf/features/registries/enums';
import {
  ClearState,
  DeleteSchemaResponse,
  HandleSchemaResponse,
  RegistriesSelectors,
} from '@osf/features/registries/store';
import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { JustificationReviewComponent } from './justification-review.component';

import { MOCK_PAGES_SCHEMA } from '@testing/mocks/registries.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import {
  CustomDialogServiceMockBuilder,
  CustomDialogServiceMockType,
} from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

describe('JustificationReviewComponent', () => {
  let component: JustificationReviewComponent;
  let fixture: ComponentFixture<JustificationReviewComponent>;
  let store: Store;
  let mockRouter: RouterMockType;
  let mockCustomDialogService: CustomDialogServiceMockType;
  let customConfirmationService: CustomConfirmationServiceMockType;
  let toastService: ToastServiceMockType;

  const MOCK_SCHEMA_RESPONSE: Partial<SchemaResponse> = {
    registrationId: 'reg-1',
    updatedResponseKeys: ['field1'],
  };

  beforeEach(() => {
    const mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'rev-1' }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/x').build();
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    toastService = ToastServiceMock.simple();
    customConfirmationService = CustomConfirmationServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [JustificationReviewComponent, MockComponent(RegistrationBlocksDataComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(ToastService, toastService),
        MockProvider(CustomConfirmationService, customConfirmationService),
        MockProvider(CustomDialogService, mockCustomDialogService),
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
    });

    store = TestBed.inject(Store);
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

  it('should dispatch handleSchemaResponse on submit', () => {
    (store.dispatch as jest.Mock).mockClear();

    component.submit();

    expect(store.dispatch).toHaveBeenCalledWith(new HandleSchemaResponse('rev-1', SchemaActionTrigger.Submit));
    expect(toastService.showSuccess).toHaveBeenCalledWith('registries.justification.successSubmit');
  });

  it('should dispatch handleSchemaResponse on acceptChanges', () => {
    (store.dispatch as jest.Mock).mockClear();

    component.acceptChanges();

    expect(store.dispatch).toHaveBeenCalledWith(new HandleSchemaResponse('rev-1', SchemaActionTrigger.Approve));
    expect(toastService.showSuccess).toHaveBeenCalledWith('registries.justification.successAccept');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/reg-1/overview');
  });

  it('should show decision recorded toast when continueEditing confirmed', () => {
    mockCustomDialogService.open.mockReturnValue({ onClose: of(true) } as any);

    component.continueEditing();

    expect(mockCustomDialogService.open).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith('registries.justification.decisionRecorded');
  });

  it('should dispatch deleteSchemaResponse and clearState after confirmation', () => {
    (store.dispatch as jest.Mock).mockClear();

    component.deleteDraftUpdate();

    expect(customConfirmationService.confirmDelete).toHaveBeenCalled();
    const call = customConfirmationService.confirmDelete.mock.calls[0][0];
    call.onConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteSchemaResponse('rev-1'));
    expect(toastService.showSuccess).toHaveBeenCalledWith('registries.justification.successDeleteDraft');
    expect(store.dispatch).toHaveBeenCalledWith(new ClearState());
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/reg-1/overview');
  });
});
