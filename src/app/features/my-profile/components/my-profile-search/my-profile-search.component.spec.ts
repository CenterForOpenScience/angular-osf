import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileSearchComponent } from './my-profile-search.component';

describe('MyProfileSearchComponent', () => {
  let component: MyProfileSearchComponent;
  let fixture: ComponentFixture<MyProfileSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
