import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { JustificationStepComponent } from './justification-step.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('JustificationStepComponent', () => {
  let component: JustificationStepComponent;
  let fixture: ComponentFixture<JustificationStepComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: jest.Mocked<Router>;
  let mockCustomConfirmationService: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  let mockToastService: ReturnType<ToastServiceMockBuilder['build']>;

  const MOCK_SCHEMA_RESPONSE = {
    registrationId: 'reg-1',
    revisionJustification: 'reason',
  } as any;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'rev-1' }).build();
    mockRouter = { navigate: jest.fn(), navigateByUrl: jest.fn(), url: '/x' } as any;
    mockCustomConfirmationService = CustomConfirmationServiceMockBuilder.create().build();
    mockToastService = ToastServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [JustificationStepComponent, OSFTestingModule],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(CustomConfirmationService, mockCustomConfirmationService as any),
        MockProvider(ToastService, mockToastService),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getSchemaResponse, value: MOCK_SCHEMA_RESPONSE },
            { selector: RegistriesSelectors.getStepsState, value: {} },
          ],
        }),
      ],
    }).compileComponents();

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
    const mockActions = {
      updateRevision: jest.fn().mockReturnValue(of({})),
      updateStepState: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: mockActions });

    component.justificationForm.patchValue({ justification: 'new reason' });
    component.submit();

    expect(mockActions.updateRevision).toHaveBeenCalledWith('rev-1', 'new reason');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../1'], {
      relativeTo: expect.any(Object),
      onSameUrlNavigation: 'reload',
    });
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
