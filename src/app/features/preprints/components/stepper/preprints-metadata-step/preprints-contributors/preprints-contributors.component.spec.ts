import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@core/store/user';
import { ContributorsTableComponent } from '@osf/shared/components/contributors';
import { ContributorModel } from '@shared/models';
import { CustomConfirmationService, CustomDialogService, ToastService } from '@shared/services';
import { ContributorsSelectors } from '@shared/stores';

import { PreprintsContributorsComponent } from './preprints-contributors.component';

import { MOCK_CONTRIBUTOR, MOCK_USER } from '@testing/mocks';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('PreprintsContributorsComponent', () => {
  let component: PreprintsContributorsComponent;
  let fixture: ComponentFixture<PreprintsContributorsComponent>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;
  let confirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  const mockContributors: ContributorModel[] = [MOCK_CONTRIBUTOR];
  const mockCurrentUser = MOCK_USER;

  beforeEach(async () => {
    toastServiceMock = ToastServiceMockBuilder.create().build();
    confirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [PreprintsContributorsComponent, OSFTestingModule, MockComponent(ContributorsTableComponent)],
      providers: [
        MockProvider(ToastService, toastServiceMock),
        MockProvider(CustomConfirmationService, confirmationServiceMock),
        MockProvider(CustomDialogService, mockCustomDialogService),
        provideMockStore({
          signals: [
            {
              selector: ContributorsSelectors.getContributors,
              value: mockContributors,
            },
            {
              selector: ContributorsSelectors.isContributorsLoading,
              value: false,
            },
            {
              selector: UserSelectors.getCurrentUser,
              value: mockCurrentUser,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsContributorsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('preprintId', 'preprint-1');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove contributor with confirmation', () => {
    const contributorToRemove = mockContributors[0];

    confirmationServiceMock.confirmDelete.mockImplementation(({ onConfirm }) => {
      onConfirm();
    });

    component.removeContributor(contributorToRemove);

    expect(confirmationServiceMock.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'project.contributors.removeDialog.title',
      messageKey: 'project.contributors.removeDialog.message',
      messageParams: { name: contributorToRemove.fullName },
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: expect.any(Function),
    });
  });

  it('should expose readonly properties', () => {
    expect(component.destroyRef).toBeDefined();
    expect(component.customDialogService).toBeDefined();
    expect(component.toastService).toBeDefined();
    expect(component.customConfirmationService).toBeDefined();
    expect(component.actions).toBeDefined();
  });

  it('should handle effect for contributors', () => {
    component.ngOnInit();

    expect(component).toBeTruthy();
  });
});
