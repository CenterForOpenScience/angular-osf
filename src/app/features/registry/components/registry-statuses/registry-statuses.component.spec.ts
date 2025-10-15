import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationReviewStates, RegistryStatus } from '@osf/shared/enums';
import { CustomConfirmationService, CustomDialogService } from '@osf/shared/services';

import { RegistryStatusesComponent } from './registry-statuses.component';

import { MOCK_REGISTRY_OVERVIEW } from '@testing/mocks/registry-overview.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryStatusesComponent', () => {
  let component: RegistryStatusesComponent;
  let fixture: ComponentFixture<RegistryStatusesComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let mockCustomConfirmationService: ReturnType<CustomConfirmationServiceMockBuilder['build']>;

  const mockRegistry = MOCK_REGISTRY_OVERVIEW;

  beforeEach(async () => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    mockCustomConfirmationService = CustomConfirmationServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [RegistryStatusesComponent, OSFTestingModule],
      providers: [
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(CustomConfirmationService, mockCustomConfirmationService),
        provideMockStore({
          signals: [],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryStatusesComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('registry', mockRegistry);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.canEdit()).toBe(false);
    expect(component.isModeration()).toBe(false);
  });

  it('should receive registry input', () => {
    expect(component.registry()).toEqual(mockRegistry);
  });

  it('should compute canWithdraw correctly', () => {
    expect(component.canWithdraw()).toBe(true);

    const registryWithPendingReview = { ...mockRegistry, reviewsState: RegistrationReviewStates.Pending };
    fixture.componentRef.setInput('registry', registryWithPendingReview);
    fixture.detectChanges();
    expect(component.canWithdraw()).toBe(false);

    fixture.componentRef.setInput('isModeration', true);
    fixture.detectChanges();
    expect(component.canWithdraw()).toBe(false);
  });

  it('should compute isAccepted correctly', () => {
    expect(component.isAccepted()).toBe(true);

    const registryWithDifferentStatus = { ...mockRegistry, status: RegistryStatus.Pending };
    fixture.componentRef.setInput('registry', registryWithDifferentStatus);
    fixture.detectChanges();
    expect(component.isAccepted()).toBe(false);
  });

  it('should compute isEmbargo correctly', () => {
    expect(component.isEmbargo()).toBe(false);

    const embargoRegistry = { ...mockRegistry, status: RegistryStatus.Embargo };
    fixture.componentRef.setInput('registry', embargoRegistry);
    fixture.detectChanges();
    expect(component.isEmbargo()).toBe(true);
  });

  it('should format embargo end date correctly', () => {
    expect(component.embargoEndDate).toBe('Mon Jan 01 2024');
  });

  it('should handle registry without embargo end date', () => {
    const registryWithoutEmbargo = { ...mockRegistry, embargoEndDate: undefined };
    fixture.componentRef.setInput('registry', registryWithoutEmbargo);
    fixture.detectChanges();

    expect(component.embargoEndDate).toBe(null);
  });

  it('should open withdraw dialog', () => {
    component.openWithdrawDialog();

    expect(mockCustomDialogService.open).toHaveBeenCalledWith(expect.any(Function), {
      header: 'registry.overview.withdrawRegistration',
      width: '552px',
      data: {
        registryId: 'test-registry-id',
      },
    });
  });

  it('should not open withdraw dialog when registry is null', () => {
    fixture.componentRef.setInput('registry', null);
    fixture.detectChanges();

    component.openWithdrawDialog();

    expect(mockCustomDialogService.open).not.toHaveBeenCalled();
  });

  it('should not open end embargo dialog when registry is null', () => {
    fixture.componentRef.setInput('registry', null);
    fixture.detectChanges();

    component.openEndEmbargoDialog();

    expect(mockCustomConfirmationService.confirmDelete).not.toHaveBeenCalled();
  });

  it('should handle different input configurations', () => {
    fixture.componentRef.setInput('canEdit', true);
    fixture.componentRef.setInput('isModeration', true);
    fixture.detectChanges();

    expect(component.canEdit()).toBe(true);
    expect(component.isModeration()).toBe(true);
  });
});
