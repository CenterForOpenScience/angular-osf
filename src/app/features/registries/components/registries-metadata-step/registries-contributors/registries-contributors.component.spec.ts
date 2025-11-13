import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ContributorsSelectors } from '@osf/shared/stores/contributors/contributors.selectors';
import { ContributorsTableComponent } from '@shared/components/contributors/contributors-table/contributors-table.component';

import { RegistriesContributorsComponent } from './registries-contributors.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('RegistriesContributorsComponent', () => {
  let component: RegistriesContributorsComponent;
  let fixture: ComponentFixture<RegistriesContributorsComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let mockCustomConfirmationService: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  let mockToast: ReturnType<ToastServiceMockBuilder['build']>;

  const initialContributors = [
    { id: '1', userId: 'u1', fullName: 'A', permission: 2 },
    { id: '2', userId: 'u2', fullName: 'B', permission: 1 },
  ] as any[];

  beforeAll(() => {
    if (typeof (globalThis as any).structuredClone !== 'function') {
      Object.defineProperty(globalThis as any, 'structuredClone', {
        configurable: true,
        writable: true,
        value: (o: unknown) => JSON.parse(JSON.stringify(o)),
      });
    }
  });

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build();
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    mockCustomConfirmationService = CustomConfirmationServiceMockBuilder.create().build();
    mockToast = ToastServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [RegistriesContributorsComponent, OSFTestingModule, MockComponent(ContributorsTableComponent)],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(CustomConfirmationService, mockCustomConfirmationService),
        MockProvider(ToastService, mockToast),
        provideMockStore({
          signals: [
            { selector: UserSelectors.getCurrentUser, value: { id: 'u1' } },
            { selector: ContributorsSelectors.getContributors, value: initialContributors },
            { selector: ContributorsSelectors.isContributorsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesContributorsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', new FormControl([]));
    const mockActions = {
      getContributors: jest.fn().mockReturnValue(of({})),
      updateContributor: jest.fn().mockReturnValue(of({})),
      addContributor: jest.fn().mockReturnValue(of({})),
      deleteContributor: jest.fn().mockReturnValue(of({})),
      bulkUpdateContributors: jest.fn().mockReturnValue(of({})),
      bulkAddContributors: jest.fn().mockReturnValue(of({})),
      resetContributorsState: jest.fn().mockRejectedValue(of({})),
    } as any;
    Object.defineProperty(component, 'actions', { value: mockActions });
    fixture.detectChanges();
  });

  it('should request contributors on init', () => {
    const actions = (component as any).actions;
    expect(actions.getContributors).toHaveBeenCalledWith('draft-1', ResourceType.DraftRegistration);
  });

  it('should cancel changes and reset local contributors', () => {
    (component as any).contributors.set([{ id: '3' }]);
    component.cancel();
    expect(component.contributors()).toEqual(JSON.parse(JSON.stringify(initialContributors)));
  });

  it('should save changed contributors and show success toast', () => {
    (component as any).contributors.set([{ ...initialContributors[0] }, { ...initialContributors[1], permission: 2 }]);
    component.save();
    expect(mockToast.showSuccess).toHaveBeenCalled();
  });

  it('should open add contributor dialog', () => {
    component.openAddContributorDialog();
    expect(mockCustomDialogService.open).toHaveBeenCalled();
  });

  it('should open add unregistered contributor dialog', () => {
    component.openAddUnregisteredContributorDialog();
    expect(mockCustomDialogService.open).toHaveBeenCalled();
  });

  it('should remove contributor after confirmation and show success toast', () => {
    const contributor = { id: '2', userId: 'u2', fullName: 'B' } as any;
    component.removeContributor(contributor);
    expect(mockCustomConfirmationService.confirmDelete).toHaveBeenCalled();
    const call = (mockCustomConfirmationService.confirmDelete as any).mock.calls[0][0];
    call.onConfirm();
    expect(mockToast.showSuccess).toHaveBeenCalled();
  });

  it('should mark control touched and dirty on focus out', () => {
    const control = new FormControl([]);
    const spy = jest.spyOn(control, 'updateValueAndValidity');
    fixture.componentRef.setInput('control', control);
    component.onFocusOut();
    expect(control.touched).toBe(true);
    expect(control.dirty).toBe(true);
    expect(spy).toHaveBeenCalled();
  });
});
