import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider, MockProviders } from 'ng-mocks';

import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE, TranslateServiceMock } from '@osf/shared/mocks';
import { ContributorsSelectors } from '@osf/shared/stores';

import { ContributorsDialogComponent } from './contributors-dialog.component';

describe('ContributorsDialogComponent', () => {
  let component: ContributorsDialogComponent;
  let fixture: ComponentFixture<ContributorsDialogComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === ContributorsSelectors.getContributors) return () => [];
      return () => [];
    });
    await TestBed.configureTestingModule({
      imports: [ContributorsDialogComponent, MockPipe(TranslatePipe)],
      providers: [
        TranslateServiceMock,
        MockProviders(MessageService, DynamicDialogRef, DynamicDialogConfig),
        MockProvider(Store, MOCK_STORE),
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
