import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TokenCreatedDialogComponent } from './token-created-dialog.component';

describe('TokenCreatedDialogComponent', () => {
  let component: TokenCreatedDialogComponent;
  let fixture: ComponentFixture<TokenCreatedDialogComponent>;

  const mockTokenName = 'Test Token';
  const mockTokenValue = 'test-token-value';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenCreatedDialogComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(TranslateService),
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

  it('should show copy notification when token is copied', () => {
    expect(fixture.componentInstance['tokenCopiedNotificationVisible']()).toBe(false);
    fixture.componentInstance['tokenCopiedToClipboard']();
    expect(fixture.componentInstance['tokenCopiedNotificationVisible']()).toBe(true);
  });

  it('should hide copy notification after 2 seconds', () => {
    jest.useFakeTimers();
    fixture.componentInstance['tokenCopiedToClipboard']();
    expect(fixture.componentInstance['tokenCopiedNotificationVisible']()).toBe(true);
    jest.advanceTimersByTime(2000);
    expect(fixture.componentInstance['tokenCopiedNotificationVisible']()).toBe(false);
    jest.useRealTimers();
  });

  it('should set input selection range to 0 after render', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(0);
  });
});
