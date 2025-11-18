import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { RegistryWithdrawDialogComponent } from './registry-withdraw-dialog.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryWithdrawDialogComponent', () => {
  let component: RegistryWithdrawDialogComponent;
  let fixture: ComponentFixture<RegistryWithdrawDialogComponent>;
  let mockDialogConfig: jest.Mocked<DynamicDialogConfig>;

  beforeEach(async () => {
    mockDialogConfig = {
      data: { registryId: 'test-registry-id' },
    } as jest.Mocked<DynamicDialogConfig>;

    await TestBed.configureTestingModule({
      imports: [RegistryWithdrawDialogComponent, OSFTestingModule, MockComponent(TextInputComponent)],
      providers: [
        DynamicDialogRefMock,
        MockProvider(DynamicDialogConfig, mockDialogConfig),
        provideMockStore({
          signals: [],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryWithdrawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
