import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RegistryStatus } from '@osf/shared/enums/registry-status.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { MakePublic } from '../../store/registry';

import { RegistryStatusesComponent } from './registry-statuses.component';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomConfirmationServiceMock } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMock } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

const MOCK_REGISTRY = { ...MOCK_REGISTRATION_OVERVIEW_MODEL, embargoEndDate: '2024-01-01T00:00:00Z' };

interface SetupOverrides {
  registry?: typeof MOCK_REGISTRY | null;
  canEdit?: boolean;
  isModeration?: boolean;
}

function setup(overrides: SetupOverrides = {}) {
  const mockDialogService = CustomDialogServiceMock.simple();
  const mockConfirmationService = CustomConfirmationServiceMock.simple();

  TestBed.configureTestingModule({
    imports: [RegistryStatusesComponent],
    providers: [
      provideOSFCore(),
      MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().build()),
      MockProvider(CustomDialogService, mockDialogService),
      MockProvider(CustomConfirmationService, mockConfirmationService),
      provideMockStore(),
    ],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(RegistryStatusesComponent);
  fixture.componentRef.setInput('registry', overrides.registry ?? MOCK_REGISTRY);
  fixture.componentRef.setInput('canEdit', overrides.canEdit ?? false);
  fixture.componentRef.setInput('isModeration', overrides.isModeration ?? false);
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance, store, mockDialogService, mockConfirmationService };
}

describe('RegistryStatusesComponent', () => {
  it('should create with default values', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
    expect(component.canEdit()).toBe(false);
    expect(component.isModeration()).toBe(false);
  });

  it('should compute canWithdraw as true when accepted and not moderation', () => {
    const { component } = setup();

    expect(component.canWithdraw()).toBe(true);
  });

  it('should compute canWithdraw as false when not accepted', () => {
    const { component } = setup({
      registry: { ...MOCK_REGISTRY, reviewsState: RegistrationReviewStates.Pending },
    });

    expect(component.canWithdraw()).toBe(false);
  });

  it('should compute canWithdraw as false when moderation', () => {
    const { component } = setup({ isModeration: true });

    expect(component.canWithdraw()).toBe(false);
  });

  it('should compute isAccepted as true for Accepted status', () => {
    const { component } = setup();

    expect(component.isAccepted()).toBe(true);
    expect(component.isEmbargo()).toBe(false);
  });

  it('should compute isEmbargo as true for Embargo status', () => {
    const { fixture, component } = setup();
    fixture.componentRef.setInput('registry', { ...MOCK_REGISTRY, status: RegistryStatus.Embargo });
    fixture.detectChanges();

    expect(component.isAccepted()).toBe(false);
    expect(component.isEmbargo()).toBe(true);
  });

  it('should compute embargoEndDate from registry', () => {
    const { component } = setup();

    expect(component.embargoEndDate()).toBe(new Date('2024-01-01T00:00:00Z').toDateString());
  });

  it('should return null embargoEndDate when not set', () => {
    const { component } = setup({
      registry: { ...MOCK_REGISTRY, embargoEndDate: '' },
    });

    expect(component.embargoEndDate()).toBeNull();
  });

  it('should open withdraw dialog with correct parameters', () => {
    const { component, mockDialogService } = setup();

    component.openWithdrawDialog();

    expect(mockDialogService.open).toHaveBeenCalledWith(expect.any(Function), {
      header: 'registry.overview.withdrawRegistration',
      width: '552px',
      data: { registryId: MOCK_REGISTRY.id },
    });
  });

  it('should not open withdraw dialog when registry is null', () => {
    const { fixture, component, mockDialogService } = setup();
    fixture.componentRef.setInput('registry', null);
    fixture.detectChanges();
    mockDialogService.open.mockClear();

    component.openWithdrawDialog();

    expect(mockDialogService.open).not.toHaveBeenCalled();
  });

  it('should call confirmDelete and dispatch MakePublic on confirm', () => {
    const { component, store, mockConfirmationService } = setup();
    jest.spyOn(store, 'dispatch');

    (mockConfirmationService.confirmDelete as jest.Mock).mockImplementation((opts) => opts.onConfirm());
    component.openEndEmbargoDialog();

    expect(mockConfirmationService.confirmDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        headerKey: 'registry.overview.endEmbargo',
        messageKey: 'registry.overview.endEmbargoMessage',
      })
    );
    expect(store.dispatch).toHaveBeenCalledWith(new MakePublic(MOCK_REGISTRY.id));
  });

  it('should not call confirmDelete when registry is null', () => {
    const { fixture, component, mockConfirmationService } = setup();
    fixture.componentRef.setInput('registry', null);
    fixture.detectChanges();

    component.openEndEmbargoDialog();

    expect(mockConfirmationService.confirmDelete).not.toHaveBeenCalled();
  });
});
