import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPreprintReviewingComponent } from './my-preprint-reviewing.component';

describe('MyPreprintReviewingComponent', () => {
  let component: MyPreprintReviewingComponent;
  let fixture: ComponentFixture<MyPreprintReviewingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPreprintReviewingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPreprintReviewingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
