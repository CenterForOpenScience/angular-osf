import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyButtonComponent } from '@shared/components';

import { TokenCreatedDialogComponent } from './token-created-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('TokenCreatedDialogComponent', () => {
  let component: TokenCreatedDialogComponent;
  let fixture: ComponentFixture<TokenCreatedDialogComponent>;

  const mockTokenName = 'Test Token';
  const mockTokenValue = 'test-token-value';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenCreatedDialogComponent, OSFTestingModule, MockComponent(CopyButtonComponent)],
      providers: [
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
});
