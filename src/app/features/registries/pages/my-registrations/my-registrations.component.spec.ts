import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { RegistrationTab } from '@osf/features/registries/enums';
import { RegistriesSelectors } from '@osf/features/registries/store';
import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { RegistrationCardComponent } from '@osf/shared/components/registration-card/registration-card.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { DeleteDraft, FetchDraftRegistrations, FetchSubmittedRegistrations } from '../../store';

import { MyRegistrationsComponent } from './my-registrations.component';

import { MockCustomConfirmationServiceProvider } from '@testing/mocks/custom-confirmation.service.mock';
import { provideOSFCore, provideOSFToast } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder, provideActivatedRouteMock } from '@testing/providers/route-provider.mock';
import { provideRouterMock, RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('MyRegistrationsComponent', () => {
  let component: MyRegistrationsComponent;
  let fixture: ComponentFixture<MyRegistrationsComponent>;
  let store: Store;
  let mockRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: RouterMockType;
  let customConfirmationService: jest.Mocked<CustomConfirmationService>;
  let toastService: jest.Mocked<ToastService>;

  function setup(queryParams: Record<string, string> = {}) {
    mockRouter = RouterMockBuilder.create().withUrl('/registries/me').build();
    mockRoute = ActivatedRouteMockBuilder.create().withQueryParams(queryParams).build();

    TestBed.configureTestingModule({
      imports: [
        MyRegistrationsComponent,
        ...MockComponents(SubHeaderComponent, SelectComponent, RegistrationCardComponent, CustomPaginatorComponent),
      ],
      providers: [
        provideOSFCore(),
        provideRouterMock(mockRouter),
        provideActivatedRouteMock(mockRoute),
        MockCustomConfirmationServiceProvider,
        provideOSFToast(),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getDraftRegistrations, value: [] },
            { selector: RegistriesSelectors.getDraftRegistrationsTotalCount, value: 0 },
            { selector: RegistriesSelectors.isDraftRegistrationsLoading, value: false },
            { selector: RegistriesSelectors.getSubmittedRegistrations, value: [] },
            { selector: RegistriesSelectors.getSubmittedRegistrationsTotalCount, value: 0 },
            { selector: RegistriesSelectors.isSubmittedRegistrationsLoading, value: false },
            { selector: UserSelectors.getCurrentUser, value: { id: 'user-1' } },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(MyRegistrationsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    customConfirmationService = TestBed.inject(CustomConfirmationService) as jest.Mocked<CustomConfirmationService>;
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should default to submitted tab and fetch submitted registrations', () => {
    setup();
    expect(component.selectedTab()).toBe(RegistrationTab.Submitted);
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSubmittedRegistrations());
  });

  it('should switch to drafts tab from query param and fetch drafts', () => {
    setup({ tab: 'drafts' });
    expect(component.selectedTab()).toBe(RegistrationTab.Drafts);
    expect(store.dispatch).toHaveBeenCalledWith(new FetchDraftRegistrations());
  });

  it('should change tab to drafts, reset pagination, fetch data, and update query params', () => {
    setup();
    (store.dispatch as jest.Mock).mockClear();
    (mockRouter.navigate as jest.Mock).mockClear();

    component.onTabChange(RegistrationTab.Drafts);

    expect(component.selectedTab()).toBe(RegistrationTab.Drafts);
    expect(component.draftFirst).toBe(0);
    expect(store.dispatch).toHaveBeenCalledWith(new FetchDraftRegistrations());
    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: { tab: 'drafts' },
      queryParamsHandling: 'merge',
    });
  });

  it('should change tab to submitted, reset pagination, fetch data, and update query params', () => {
    setup();
    component.onTabChange(RegistrationTab.Drafts);
    (store.dispatch as jest.Mock).mockClear();
    (mockRouter.navigate as jest.Mock).mockClear();

    component.onTabChange(RegistrationTab.Submitted);

    expect(component.selectedTab()).toBe(RegistrationTab.Submitted);
    expect(component.submittedFirst).toBe(0);
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSubmittedRegistrations());
    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: { tab: 'submitted' },
      queryParamsHandling: 'merge',
    });
  });

  it('should ignore invalid tab values', () => {
    setup();
    (store.dispatch as jest.Mock).mockClear();
    const initialTab = component.selectedTab();

    component.onTabChange('invalid');
    component.onTabChange(0);

    expect(component.selectedTab()).toBe(initialTab);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should navigate to create registration page', () => {
    setup();
    component.goToCreateRegistration();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries', 'osf', 'new']);
  });

  it('should handle drafts pagination', () => {
    setup();
    (store.dispatch as jest.Mock).mockClear();

    component.onDraftsPageChange({ page: 2, first: 20 });

    expect(store.dispatch).toHaveBeenCalledWith(new FetchDraftRegistrations(3));
    expect(component.draftFirst).toBe(20);
  });

  it('should handle submitted pagination', () => {
    setup();
    (store.dispatch as jest.Mock).mockClear();

    component.onSubmittedPageChange({ page: 1, first: 10 });

    expect(store.dispatch).toHaveBeenCalledWith(new FetchSubmittedRegistrations(2));
    expect(component.submittedFirst).toBe(10);
  });

  it('should delete draft after confirmation', () => {
    setup();
    (store.dispatch as jest.Mock).mockClear();
    customConfirmationService.confirmDelete.mockImplementation(({ onConfirm }) => {
      onConfirm();
    });

    component.onDeleteDraft('draft-123');

    expect(customConfirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'registries.deleteDraft',
      messageKey: 'registries.confirmDeleteDraft',
      onConfirm: expect.any(Function),
    });
    expect(store.dispatch).toHaveBeenCalledWith(new DeleteDraft('draft-123'));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchDraftRegistrations());
    expect(toastService.showSuccess).toHaveBeenCalledWith('registries.successDeleteDraft');
  });

  it('should not delete draft if confirmation is cancelled', () => {
    setup();
    (store.dispatch as jest.Mock).mockClear();
    toastService.showSuccess.mockClear();
    customConfirmationService.confirmDelete.mockImplementation(() => {});

    component.onDeleteDraft('draft-123');

    expect(customConfirmationService.confirmDelete).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });
});
