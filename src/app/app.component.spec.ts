import { provideStore, Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { GetCurrentUser, UserState } from '@core/store/user';

import { FullScreenLoaderComponent, ToastComponent } from './shared/components';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, ...MockComponents(ToastComponent, FullScreenLoaderComponent)],
      providers: [provideStore([UserState]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetCurrentUser action on initialization', () => {
    const store = TestBed.inject(Store);
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    store.dispatch(GetCurrentUser);
    expect(dispatchSpy).toHaveBeenCalledWith(GetCurrentUser);
  });

  it('should render router outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });
});
