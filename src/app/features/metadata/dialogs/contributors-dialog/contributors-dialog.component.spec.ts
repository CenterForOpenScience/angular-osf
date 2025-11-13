import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ContributorsSelectors } from '@osf/shared/stores/contributors';
import { ContributorsTableComponent } from '@shared/components/contributors';
import { ContributorModel } from '@shared/models/contributors/contributor.model';

import { ContributorsDialogComponent } from './contributors-dialog.component';

import { MOCK_CONTRIBUTOR } from '@testing/mocks/contributors.mock';
import { MockCustomConfirmationServiceProvider } from '@testing/mocks/custom-confirmation.service.mock';
import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ContributorsDialogComponent', () => {
  let component: ContributorsDialogComponent;
  let fixture: ComponentFixture<ContributorsDialogComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let dialogRef: DynamicDialogRef;
  let config: DynamicDialogConfig;

  const mockContributors: ContributorModel[] = [MOCK_CONTRIBUTOR];

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
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        ContributorsDialogComponent,
        OSFTestingModule,
        ...MockComponents(SearchInputComponent, ContributorsTableComponent),
      ],
      providers: [
        TranslateServiceMock,
        MockCustomConfirmationServiceProvider,
        provideMockStore({
          signals: [
            { selector: ContributorsSelectors.getContributors, value: mockContributors },
            { selector: ContributorsSelectors.isContributorsLoading, value: false },
            { selector: ContributorsSelectors.getContributorsTotalCount, value: mockContributors },
          ],
        }),
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(DynamicDialogConfig, {
          data: {
            resourceId: 'test-resource-id',
            resourceType: 1,
          },
        }),
        MockProvider(DynamicDialogRef, {
          close: jest.fn(),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorsDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    config = TestBed.inject(DynamicDialogConfig);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.searchControl.value).toBe('');
    expect(component.contributors()).toEqual([]);
  });

  it('should set search subscription on init', () => {
    const setSearchSubscriptionSpy = jest.spyOn(component as any, 'setSearchSubscription');

    component.ngOnInit();

    expect(setSearchSubscriptionSpy).toHaveBeenCalled();
  });

  it('should have openAddContributorDialog method', () => {
    expect(typeof component.openAddContributorDialog).toBe('function');
  });

  it('should have openAddUnregisteredContributorDialog method', () => {
    expect(typeof component.openAddUnregisteredContributorDialog).toBe('function');
  });

  it('should remove contributor with confirmation', () => {
    const contributor = mockContributors[0];
    const confirmDeleteSpy = jest.spyOn(component['customConfirmationService'], 'confirmDelete');

    component.removeContributor(contributor);

    expect(confirmDeleteSpy).toHaveBeenCalledWith({
      headerKey: 'project.contributors.removeDialog.title',
      messageKey: 'project.contributors.removeDialog.message',
      messageParams: { name: contributor.fullName },
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: expect.any(Function),
    });
  });

  it('should cancel and reset contributors', () => {
    const newContributors = [mockContributors[1]];
    component.contributors.set(newContributors);

    component.cancel();

    expect(component.contributors()).toEqual(mockContributors);
  });

  it('should close dialog', () => {
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.onClose();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should compute search placeholder for registration', () => {
    config.data.resourceType = 2;
    expect(component.searchPlaceholder).toBe('project.contributors.searchRegistrationPlaceholder');
  });
});
