import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { MyRegistrationsRedirectComponent } from './my-registrations-redirect.component';

import { RouterMock } from '@testing/providers/router-provider.mock';

describe('MyRegistrationsRedirectComponent', () => {
  let component: MyRegistrationsRedirectComponent;
  let fixture: ComponentFixture<MyRegistrationsRedirectComponent>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    const routerMock = RouterMock.create().build();

    TestBed.configureTestingModule({
      imports: [MyRegistrationsRedirectComponent],
      providers: [MockProvider(Router, routerMock)],
    });

    fixture = TestBed.createComponent(MyRegistrationsRedirectComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /my-registrations on component creation', () => {
    expect(router.navigate).toHaveBeenCalledWith(['/my-registrations'], {
      queryParamsHandling: 'preserve',
      replaceUrl: true,
    });
  });
});
