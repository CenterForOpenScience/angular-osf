import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE, MockCustomConfirmationServiceProvider, TranslateServiceMock } from '@osf/shared/mocks';
import { CustomDialogService } from '@osf/shared/services';
import { ContributorsSelectors } from '@osf/shared/stores';

import { ContributorsDialogComponent } from './contributors-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';

describe('ContributorsDialogComponent', () => {
  let component: ContributorsDialogComponent;
  let fixture: ComponentFixture<ContributorsDialogComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

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

    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === ContributorsSelectors.getContributors) return () => [];
      return () => [];
    });
    await TestBed.configureTestingModule({
      imports: [ContributorsDialogComponent, OSFTestingModule],
      providers: [
        TranslateServiceMock,
        MockCustomConfirmationServiceProvider,
        MockProvider(Store, MOCK_STORE),
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
