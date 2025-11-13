import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to submitted tab and fetch submitted registrations', () => {
    const actionsMock = {
      getDraftRegistrations: jest.fn(),
      getSubmittedRegistrations: jest.fn(),
      deleteDraft: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });

    component.selectedTab.set(component.RegistrationTab.Drafts);
    fixture.detectChanges();
    component.selectedTab.set(component.RegistrationTab.Submitted);
    fixture.detectChanges();
    expect(actionsMock.getSubmittedRegistrations).toHaveBeenCalledWith('user-1');
  });

  it('should navigate to create registration page', () => {
    const navSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    component.goToCreateRegistration();
    expect(navSpy).toHaveBeenCalledWith(['/registries/osf/new']);
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
    expect(actionsMock.getSubmittedRegistrations).toHaveBeenCalledWith('user-1', 2);
    expect(component.submittedFirst).toBe(10);
  });

  it('should switch to drafts tab based on query param and fetch drafts', async () => {
    (mockActivatedRoute.snapshot as any).queryParams = { tab: 'drafts' };
    const actionsMock = { getDraftRegistrations: jest.fn(), getSubmittedRegistrations: jest.fn() } as any;
    fixture = TestBed.createComponent(MyRegistrationsComponent);
    component = fixture.componentInstance;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    fixture.detectChanges();

    expect(component.selectedTab()).toBe(0);
    component.selectedTab.set(component.RegistrationTab.Submitted);
    fixture.detectChanges();
    component.selectedTab.set(component.RegistrationTab.Drafts);
    fixture.detectChanges();
    expect(actionsMock.getDraftRegistrations).toHaveBeenCalled();
  });
});
