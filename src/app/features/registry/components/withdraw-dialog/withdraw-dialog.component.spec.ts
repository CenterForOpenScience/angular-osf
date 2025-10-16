import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputComponent } from '@shared/components';

import { WithdrawDialogComponent } from './withdraw-dialog.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('WithdrawDialogComponent', () => {
  let component: WithdrawDialogComponent;
  let fixture: ComponentFixture<WithdrawDialogComponent>;
  let mockDialogConfig: jest.Mocked<DynamicDialogConfig>;

  beforeEach(async () => {
    mockDialogConfig = {
      data: { registryId: 'test-registry-id' },
    } as jest.Mocked<DynamicDialogConfig>;

    await TestBed.configureTestingModule({
      imports: [WithdrawDialogComponent, OSFTestingModule, MockComponent(TextInputComponent)],
      providers: [
        DynamicDialogRefMock,
        MockProvider(DynamicDialogConfig, mockDialogConfig),
        provideMockStore({
          signals: [],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WithdrawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.submitting).toBe(false);
    expect(component.form.get('text')?.value).toBe('');
  });

  it('should have form validators', () => {
    const textControl = component.form.get('text');

    expect(textControl?.hasError('required')).toBe(true);

    textControl?.setValue('Valid withdrawal reason');
    expect(textControl?.hasError('required')).toBe(false);
  });

  it('should handle form validation state', () => {
    expect(component.form.valid).toBe(false);

    component.form.patchValue({
      text: 'Valid withdrawal reason',
    });

    expect(component.form.valid).toBe(true);

    component.form.patchValue({
      text: '',
    });

    expect(component.form.valid).toBe(false);
  });
});
