import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RegistryStatus } from '@osf/shared/enums/registry-status.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { MakePublic } from '../../store/registry';

import { RegistryStatusesComponent } from './registry-statuses.component';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryStatusesComponent', () => {
  let component: RegistryStatusesComponent;
  let fixture: ComponentFixture<RegistryStatusesComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let mockCustomConfirmationService: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  let store: Store;

  const mockRegistry = { ...MOCK_REGISTRATION_OVERVIEW_MODEL, embargoEndDate: '2024-01-01T00:00:00Z' };
  const mockEnvironment = { supportEmail: 'support@osf.io' };

  beforeEach(async () => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    mockCustomConfirmationService = CustomConfirmationServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [RegistryStatusesComponent, OSFTestingModule],
      providers: [
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(CustomConfirmationService, mockCustomConfirmationService),
        MockProvider(ENVIRONMENT, mockEnvironment),
        provideMockStore({
          signals: [],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryStatusesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.componentRef.setInput('registry', mockRegistry);
    fixture.detectChanges();
  });

  it('should initialize with default input values', () => {
    expect(component.canEdit()).toBe(false);
    expect(component.isModeration()).toBe(false);
  });

  it('should initialize supportEmail from environment', () => {
    expect(component.supportEmail).toBe('support@osf.io');
  });

  it('should expose RegistryStatus enum', () => {
    expect(component.RegistryStatus).toBe(RegistryStatus);
  });

  it('should expose RevisionReviewStates enum', () => {
    expect(component.RevisionReviewStates).toBe(RevisionReviewStates);
  });

  it('should receive registry input', () => {
    expect(component.registry()).toEqual(mockRegistry);
  });

  it('should update canEdit input', () => {
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();

    expect(component.canEdit()).toBe(true);
  });

  it('should update isModeration input', () => {
    fixture.componentRef.setInput('isModeration', true);
    fixture.detectChanges();

    expect(component.isModeration()).toBe(true);
  });

  describe('canWithdraw', () => {
    it('should return true when reviewsState is Accepted and isModeration is false', () => {
      expect(component.canWithdraw()).toBe(true);
    });

    it('should return false when reviewsState is not Accepted', () => {
      const registryWithPendingReview = { ...mockRegistry, reviewsState: RegistrationReviewStates.Pending };
      fixture.componentRef.setInput('registry', registryWithPendingReview);
      fixture.detectChanges();

      expect(component.canWithdraw()).toBe(false);
    });

    it('should return false when isModeration is true', () => {
      fixture.componentRef.setInput('isModeration', true);
      fixture.detectChanges();

      expect(component.canWithdraw()).toBe(false);
    });

    it('should return false when both conditions are not met', () => {
      const registryWithPendingReview = { ...mockRegistry, reviewsState: RegistrationReviewStates.Pending };
      fixture.componentRef.setInput('registry', registryWithPendingReview);
      fixture.componentRef.setInput('isModeration', true);
      fixture.detectChanges();

      expect(component.canWithdraw()).toBe(false);
    });
  });

  describe('isAccepted', () => {
    it('should return true when status is Accepted', () => {
      expect(component.isAccepted()).toBe(true);
    });

    it('should return false when status is not Accepted', () => {
      const registryWithDifferentStatus = { ...mockRegistry, status: RegistryStatus.Pending };
      fixture.componentRef.setInput('registry', registryWithDifferentStatus);
      fixture.detectChanges();

      expect(component.isAccepted()).toBe(false);
    });

    it('should return false when status is Embargo', () => {
      const embargoRegistry = { ...mockRegistry, status: RegistryStatus.Embargo };
      fixture.componentRef.setInput('registry', embargoRegistry);
      fixture.detectChanges();

      expect(component.isAccepted()).toBe(false);
    });
  });

  describe('isEmbargo', () => {
    it('should return false when status is not Embargo', () => {
      expect(component.isEmbargo()).toBe(false);
    });

    it('should return true when status is Embargo', () => {
      const embargoRegistry = { ...mockRegistry, status: RegistryStatus.Embargo };
      fixture.componentRef.setInput('registry', embargoRegistry);
      fixture.detectChanges();

      expect(component.isEmbargo()).toBe(true);
    });
  });

  describe('embargoEndDate getter', () => {
    it('should format embargo end date correctly', () => {
      const date = new Date('2024-01-01T00:00:00Z').toDateString();
      expect(component.embargoEndDate).toBe(date);
    });

    it('should return null when registry has no embargo end date', () => {
      const registryWithoutEmbargo = { ...mockRegistry, embargoEndDate: undefined };
      fixture.componentRef.setInput('registry', registryWithoutEmbargo);
      fixture.detectChanges();

      expect(component.embargoEndDate).toBe(null);
    });
  });

  describe('openWithdrawDialog', () => {
    it('should open withdraw dialog with correct parameters', () => {
      component.openWithdrawDialog();

      expect(mockCustomDialogService.open).toHaveBeenCalledWith(expect.any(Function), {
        header: 'registry.overview.withdrawRegistration',
        width: '552px',
        data: {
          registryId: mockRegistry.id,
        },
      });
    });

    it('should use correct registryId from registry', () => {
      const registryWithDifferentId = { ...mockRegistry, id: 'different-registry-id' };
      fixture.componentRef.setInput('registry', registryWithDifferentId);
      fixture.detectChanges();

      component.openWithdrawDialog();

      expect(mockCustomDialogService.open).toHaveBeenCalledWith(expect.any(Function), {
        header: 'registry.overview.withdrawRegistration',
        width: '552px',
        data: {
          registryId: 'different-registry-id',
        },
      });
    });
  });

  describe('openEndEmbargoDialog', () => {
    it('should call confirmDelete with correct parameters', () => {
      component.openEndEmbargoDialog();

      expect(mockCustomConfirmationService.confirmDelete).toHaveBeenCalledWith({
        headerKey: 'registry.overview.endEmbargo',
        messageKey: 'registry.overview.endEmbargoMessage',
        acceptLabelKey: 'common.buttons.confirm',
        onConfirm: expect.any(Function),
      });
    });

    it('should dispatch MakePublic with correct registryId', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const registryWithDifferentId = { ...mockRegistry, id: 'different-registry-id' };
      fixture.componentRef.setInput('registry', registryWithDifferentId);
      fixture.detectChanges();

      let onConfirmCallback: () => void;
      (mockCustomConfirmationService.confirmDelete as jest.Mock).mockImplementation((options) => {
        onConfirmCallback = options.onConfirm;
      });

      component.openEndEmbargoDialog();
      onConfirmCallback!();

      expect(dispatchSpy).toHaveBeenCalledWith(new MakePublic('different-registry-id'));
    });
  });
});
