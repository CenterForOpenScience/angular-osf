import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileFilterChipsComponent } from './my-profile-filter-chips.component';

describe('FilterChipsComponent', () => {
  let component: MyProfileFilterChipsComponent;
  let fixture: ComponentFixture<MyProfileFilterChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileFilterChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileFilterChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
