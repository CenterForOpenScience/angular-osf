import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { RegistrationTab } from '@osf/features/registries/enums';
import { RegistriesSelectors } from '@osf/features/registries/store';
import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { RegistrationCardComponent } from '@osf/shared/components/registration-card/registration-card.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MyRegistrationsComponent } from './my-registrations.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('MyRegistrationsComponent', () => {
  let component: MyRegistrationsComponent;
  let fixture: ComponentFixture<MyRegistrationsComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let customConfirmationService: jest.Mocked<CustomConfirmationService>;
  let toastService: jest.Mocked<ToastService>;

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().withUrl('/registries/me').build();
    mockActivatedRoute = { snapshot: { queryParams: {} } } as any;

    await TestBed.configureTestingModule({
      imports: [
        MyRegistrationsComponent,
        OSFTestingModule,
        ...MockComponents(SubHeaderComponent, SelectComponent, RegistrationCardComponent, CustomPaginatorComponent),
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        MockProvider(CustomConfirmationService, { confirmDelete: jest.fn() }),
        MockProvider(ToastService, { showSuccess: jest.fn(), showWarn: jest.fn(), showError: jest.fn() }),
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
    }).compileComponents();

    fixture = TestBed.createComponent(MyRegistrationsComponent);
    component = fixture.componentInstance;
    customConfirmationService = TestBed.inject(CustomConfirmationService) as jest.Mocked<CustomConfirmationService>;
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to submitted tab when no query param', () => {
    expect(component.selectedTab()).toBe(RegistrationTab.Submitted);
  });

  it('should switch to drafts tab when query param is drafts', () => {
    (mockActivatedRoute.snapshot as any).queryParams = { tab: 'drafts' };

    fixture = TestBed.createComponent(MyRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.selectedTab()).toBe(RegistrationTab.Drafts);
  });

  it('should switch to submitted tab when query param is submitted', () => {
    (mockActivatedRoute.snapshot as any).queryParams = { tab: 'submitted' };

    fixture = TestBed.createComponent(MyRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.selectedTab()).toBe(RegistrationTab.Submitted);
  });

  it('should handle tab change and update query params', () => {
    const actionsMock = {
      getDraftRegistrations: jest.fn(),
      getSubmittedRegistrations: jest.fn(),
      deleteDraft: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');

    component.onTabChange(RegistrationTab.Drafts);

    expect(component.selectedTab()).toBe(RegistrationTab.Drafts);
    expect(component.draftFirst).toBe(0);
    expect(actionsMock.getDraftRegistrations).toHaveBeenCalledWith();
    expect(navigateSpy).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      queryParams: { tab: 'drafts' },
      queryParamsHandling: 'merge',
    });
  });

  it('should handle tab change to submitted and update query params', () => {
    const actionsMock = {
      getDraftRegistrations: jest.fn(),
      getSubmittedRegistrations: jest.fn(),
      deleteDraft: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');

    component.onTabChange(RegistrationTab.Submitted);

    expect(component.selectedTab()).toBe(RegistrationTab.Submitted);
    expect(component.submittedFirst).toBe(0);
    expect(actionsMock.getSubmittedRegistrations).toHaveBeenCalledWith();
    expect(navigateSpy).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      queryParams: { tab: 'submitted' },
      queryParamsHandling: 'merge',
    });
  });

  it('should not process tab change if tab is not a number', () => {
    const actionsMock = {
      getDraftRegistrations: jest.fn(),
      getSubmittedRegistrations: jest.fn(),
      deleteDraft: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    const initialTab = component.selectedTab();

    component.onTabChange('invalid' as any);

    expect(component.selectedTab()).toBe(initialTab);
    expect(actionsMock.getDraftRegistrations).not.toHaveBeenCalled();
    expect(actionsMock.getSubmittedRegistrations).not.toHaveBeenCalled();
  });

  it('should navigate to create registration page', () => {
    const navSpy = jest.spyOn(mockRouter, 'navigate');
    component.goToCreateRegistration();
    expect(navSpy).toHaveBeenLastCalledWith(['/registries', 'osf', 'new']);
  });

  it('should handle drafts pagination', () => {
    const actionsMock = { getDraftRegistrations: jest.fn() } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    component.onDraftsPageChange({ page: 2, first: 20 } as any);
    expect(actionsMock.getDraftRegistrations).toHaveBeenCalledWith(3);
    expect(component.draftFirst).toBe(20);
  });

  it('should handle submitted pagination', () => {
    const actionsMock = { getSubmittedRegistrations: jest.fn() } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    component.onSubmittedPageChange({ page: 1, first: 10 } as any);
    expect(actionsMock.getSubmittedRegistrations).toHaveBeenCalledWith(2);
    expect(component.submittedFirst).toBe(10);
  });

  it('should delete draft after confirmation', () => {
    const actionsMock = {
      getDraftRegistrations: jest.fn(),
      getSubmittedRegistrations: jest.fn(),
      deleteDraft: jest.fn(() => of({})),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    customConfirmationService.confirmDelete.mockImplementation(({ onConfirm }) => {
      onConfirm();
    });

    component.onDeleteDraft('draft-123');

    expect(customConfirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'registries.deleteDraft',
      messageKey: 'registries.confirmDeleteDraft',
      onConfirm: expect.any(Function),
    });
    expect(actionsMock.deleteDraft).toHaveBeenCalledWith('draft-123');
    expect(actionsMock.getDraftRegistrations).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith('registries.successDeleteDraft');
  });

  it('should not delete draft if confirmation is cancelled', () => {
    const actionsMock = {
      getDraftRegistrations: jest.fn(),
      getSubmittedRegistrations: jest.fn(),
      deleteDraft: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    customConfirmationService.confirmDelete.mockImplementation(() => {});

    component.onDeleteDraft('draft-123');

    expect(customConfirmationService.confirmDelete).toHaveBeenCalled();
    expect(actionsMock.deleteDraft).not.toHaveBeenCalled();
    expect(actionsMock.getDraftRegistrations).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should reset draftFirst when switching to drafts tab', () => {
    component.draftFirst = 20;
    const actionsMock = {
      getDraftRegistrations: jest.fn(),
      getSubmittedRegistrations: jest.fn(),
      deleteDraft: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });

    component.onTabChange(RegistrationTab.Drafts);

    expect(component.draftFirst).toBe(0);
  });

  it('should reset submittedFirst when switching to submitted tab', () => {
    component.submittedFirst = 20;
    const actionsMock = {
      getDraftRegistrations: jest.fn(),
      getSubmittedRegistrations: jest.fn(),
      deleteDraft: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });

    component.onTabChange(RegistrationTab.Submitted);

    expect(component.submittedFirst).toBe(0);
  });
});
