import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MyReviewingNavigationComponent } from './my-reviewing-navigation.component';

describe('MyReviewingNavigationComponent', () => {
  let component: MyReviewingNavigationComponent;
  let componentRef: ComponentRef<MyReviewingNavigationComponent>;
  let fixture: ComponentFixture<MyReviewingNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyReviewingNavigationComponent, MockPipe(TranslatePipe)],
      providers: [MockProvider(ActivatedRoute, { params: of({}) })],
    }).compileComponents();

    fixture = TestBed.createComponent(MyReviewingNavigationComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('provider', {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
