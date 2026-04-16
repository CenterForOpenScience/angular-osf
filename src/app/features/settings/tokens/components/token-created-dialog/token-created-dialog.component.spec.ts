import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyButtonComponent } from '@osf/shared/components/copy-button/copy-button.component';

import { MOCK_TOKEN } from '@testing/mocks/token.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { TokenCreatedDialogComponent } from './token-created-dialog.component';

describe('TokenCreatedDialogComponent', () => {
  let component: TokenCreatedDialogComponent;
  let fixture: ComponentFixture<TokenCreatedDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TokenCreatedDialogComponent, MockComponent(CopyButtonComponent)],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, {
          data: {
            tokenName: MOCK_TOKEN.name,
            tokenValue: MOCK_TOKEN.scopes[0],
          },
        }),
      ],
    });

    fixture = TestBed.createComponent(TokenCreatedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize inputs from dialog config', () => {
    expect(component.tokenName()).toBe(MOCK_TOKEN.name);
    expect(component.tokenId()).toBe(MOCK_TOKEN.scopes[0]);
  });
});
