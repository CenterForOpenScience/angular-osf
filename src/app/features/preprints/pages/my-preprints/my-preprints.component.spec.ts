import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPreprintsComponent } from './my-preprints.component';

describe('MyPreprintsComponent', () => {
  let component: MyPreprintsComponent;
  let fixture: ComponentFixture<MyPreprintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPreprintsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPreprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
