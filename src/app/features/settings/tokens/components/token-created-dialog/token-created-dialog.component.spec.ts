import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyButtonComponent } from '@shared/components';

import { TokenCreatedDialogComponent } from './token-created-dialog.component';

import { MOCK_TOKEN } from '@testing/mocks';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('TokenCreatedDialogComponent', () => {
  let component: TokenCreatedDialogComponent;
  let fixture: ComponentFixture<TokenCreatedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenCreatedDialogComponent, OSFTestingModule, MockComponent(CopyButtonComponent)],
      providers: [
        MockProvider(DynamicDialogRef, { close: jest.fn() }),
        MockProvider(DynamicDialogConfig, {
          data: {
            tokenName: MOCK_TOKEN.name,
            tokenValue: MOCK_TOKEN.scopes[0],
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

  it('should initialize inputs from dialog config', () => {
    expect(component.tokenName()).toBe(MOCK_TOKEN.name);
    expect(component.tokenId()).toBe(MOCK_TOKEN.scopes[0]);
  });

  it('should set selection range after render', () => {
    const fixture = TestBed.createComponent(TokenCreatedDialogComponent);
    const zone = TestBed.inject(NgZone);
    const spy = jest.spyOn(HTMLInputElement.prototype, 'setSelectionRange');

    zone.run(() => {
      fixture.autoDetectChanges(true);
      fixture.detectChanges();
    });

    expect(spy).toHaveBeenCalledWith(0, 0);
  });
});
