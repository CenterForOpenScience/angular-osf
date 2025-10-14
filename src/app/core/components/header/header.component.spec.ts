import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@osf/core/store/user';

import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

import { HeaderComponent } from './header.component';

import { MOCK_STORE, MOCK_USER } from '@testing/mocks';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    MOCK_STORE.selectSignal.mockImplementation((selector) => {
      if (selector === UserSelectors.getCurrentUser) return () => signal(MOCK_USER);
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, MockComponent(BreadcrumbComponent), MockPipe(TranslatePipe)],
      providers: [MockProvider(Store, MOCK_STORE), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
