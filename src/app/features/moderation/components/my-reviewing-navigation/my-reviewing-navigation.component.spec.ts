import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReviewingNavigationComponent } from './my-reviewing-navigation.component';

describe('MyReviewingNavigationComponent', () => {
  let component: MyReviewingNavigationComponent;
  let fixture: ComponentFixture<MyReviewingNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyReviewingNavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyReviewingNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
