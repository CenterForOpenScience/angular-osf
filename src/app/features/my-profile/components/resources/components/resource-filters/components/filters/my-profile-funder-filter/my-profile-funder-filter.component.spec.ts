import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileFunderFilterComponent } from './my-profile-funder-filter.component';

describe('MyProfileFunderFilterComponent', () => {
  let component: MyProfileFunderFilterComponent;
  let fixture: ComponentFixture<MyProfileFunderFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileFunderFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileFunderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
