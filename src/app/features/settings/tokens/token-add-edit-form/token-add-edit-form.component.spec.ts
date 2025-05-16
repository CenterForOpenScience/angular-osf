import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TokenAddEditFormComponent } from './token-add-edit-form.component';

describe('TokenAddEditFormComponent', () => {
  let component: TokenAddEditFormComponent;
  let fixture: ComponentFixture<TokenAddEditFormComponent>;
  let store: Partial<Store>;
  let dialogService: Partial<DialogService>;
  let dialogRef: Partial<DynamicDialogRef>;
  let activatedRoute: Partial<ActivatedRoute>;

  const mockToken = {
    id: '1',
    name: 'Test Token',
    tokenId: 'token1',
    scopes: ['read', 'write'],
    ownerId: 'user1',
  };

  const mockScopes = [
    { id: 'read', attributes: { description: 'Read access' } },
    { id: 'write', attributes: { description: 'Write access' } },
  ];

  beforeEach(async () => {
    store = {
      dispatch: jest.fn().mockReturnValue(of(undefined)),
      selectSignal: jest.fn().mockReturnValue(() => mockScopes),
      selectSnapshot: jest.fn().mockReturnValue([mockToken]),
    };

    dialogService = {
      open: jest.fn(),
    };

    dialogRef = {
      close: jest.fn(),
    };

    activatedRoute = {
      params: of({ id: mockToken.id }),
    };

    await TestBed.configureTestingModule({
      imports: [TokenAddEditFormComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(TranslateService),
        MockProvider(Store, store),
        MockProvider(DialogService, dialogService),
        MockProvider(DynamicDialogRef, dialogRef),
        MockProvider(ActivatedRoute, activatedRoute),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenAddEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
