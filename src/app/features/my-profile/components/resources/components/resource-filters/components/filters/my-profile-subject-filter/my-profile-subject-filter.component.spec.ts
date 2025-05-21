import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileSubjectFilterComponent } from './my-profile-subject-filter.component';

describe('MyProfileSubjectFilterComponent', () => {
  let component: MyProfileSubjectFilterComponent;
  let fixture: ComponentFixture<MyProfileSubjectFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileSubjectFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileSubjectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
