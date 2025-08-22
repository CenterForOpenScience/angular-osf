import { MockProvider } from 'ng-mocks';

import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';

import { TokenCreatedDialogComponent } from './token-created-dialog.component';

describe('TokenCreatedDialogComponent', () => {
  let component: TokenCreatedDialogComponent;
  let fixture: ComponentFixture<TokenCreatedDialogComponent>;
  let dialogService: Partial<DialogService>;
  let dialogRef: Partial<DynamicDialogRef>;
  let activatedRoute: Partial<ActivatedRoute>;
  let router: Partial<Router>;
  let toastService: Partial<ToastService>;

  const mockTokenName = 'Test Token';
  const mockTokenValue = 'test-token-value';

  beforeEach(async () => {
    dialogService = {
      open: jest.fn(),
    };

    dialogRef = {
      close: jest.fn(),
    };

    router = {
      navigate: jest.fn(),
    };

    toastService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TokenCreatedDialogComponent],
      providers: [
        TranslateServiceMock,
        MockProvider(ToastService),
        MockProvider(DynamicDialogRef, { close: jest.fn() }),
        MockProvider(DynamicDialogConfig, {
          data: {
            tokenName: mockTokenName,
            tokenValue: mockTokenValue,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenCreatedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with token data from config', () => {
    expect(component.tokenName()).toBe(mockTokenName);
    expect(component.tokenId()).toBe(mockTokenValue);
  });

  it('should display token name and value in the template', () => {
    const tokenInput = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(tokenInput.value).toBe(mockTokenValue);
  });

  it('should set input selection range to 0 after render', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(0);
  });
});
