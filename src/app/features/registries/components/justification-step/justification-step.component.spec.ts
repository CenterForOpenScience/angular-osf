import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ClearState,
  DeleteSchemaResponse,
  RegistriesSelectors,
  UpdateSchemaResponse,
  UpdateStepState,
} from '@osf/features/registries/store';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { JustificationStepComponent } from './justification-step.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

describe('JustificationStepComponent', () => {
  let component: JustificationStepComponent;
  let fixture: ComponentFixture<JustificationStepComponent>;
  let store: Store;
  let mockRouter: RouterMockType;
  let toastService: ToastServiceMockType;
  let customConfirmationService: CustomConfirmationServiceMockType;

  const MOCK_SCHEMA_RESPONSE: Partial<SchemaResponse> = {
    registrationId: 'reg-1',
    revisionJustification: 'reason',
  };

  beforeEach(() => {
    const mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'rev-1' }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/x').build();
    toastService = ToastServiceMock.simple();
    customConfirmationService = CustomConfirmationServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [JustificationStepComponent],
      providers: [
        provideOSFCore(),
        MockProvider(ToastService, toastService),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(CustomConfirmationService, customConfirmationService),
        provideMockStore({
          signals: [{ selector: RegistriesSelectors.getSchemaResponse, value: MOCK_SCHEMA_RESPONSE }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(JustificationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch justification when schema has justification', () => {
    expect(component.justificationForm.value.justification).toBe('reason');
  });

  it('should submit justification and navigate to first step', () => {
    component.justificationForm.patchValue({ justification: 'new reason' });
    (store.dispatch as jest.Mock).mockClear();

    component.submit();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateSchemaResponse('rev-1', 'new reason'));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../1'], {
      relativeTo: expect.any(Object),
      onSameUrlNavigation: 'reload',
    });
  });

  it('should delete draft update after confirmation', () => {
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

  it('should dispatch updateStepState and updateRevision on destroy when form changed', () => {
    component.justificationForm.patchValue({ justification: 'changed reason' });
    (store.dispatch as jest.Mock).mockClear();

    component.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateStepState('0', false, true));
    expect(store.dispatch).toHaveBeenCalledWith(new UpdateSchemaResponse('rev-1', 'changed reason'));
  });

  it('should not dispatch updateRevision on destroy when form is unchanged', () => {
    (store.dispatch as jest.Mock).mockClear();

    component.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateStepState('0', false, true));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateSchemaResponse));
  });
});
