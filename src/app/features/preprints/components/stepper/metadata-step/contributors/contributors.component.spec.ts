import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { CustomConfirmationService, ToastService } from '@shared/services';

import { ContributorsComponent } from './contributors.component';

describe('ContributorsComponent', () => {
  let component: ContributorsComponent;
  let fixture: ComponentFixture<ContributorsComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation(() => () => []);

    await TestBed.configureTestingModule({
      imports: [ContributorsComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(Store, MOCK_STORE),
        MockProvider(DialogService),
        MockProvider(ToastService),
        MockProvider(CustomConfirmationService),
        TranslateServiceMock,
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('preprintId', '1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
