import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorModel } from '@osf/shared/models';
import { CustomDialogService } from '@osf/shared/services';
import { ContributorsSelectors } from '@osf/shared/stores';
import { SearchInputComponent } from '@shared/components';
import { ContributorsTableComponent } from '@shared/components/contributors';

import { ContributorsDialogComponent } from './contributors-dialog.component';

import { MOCK_CONTRIBUTOR, MockCustomConfirmationServiceProvider, TranslateServiceMock } from '@testing/mocks';
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
