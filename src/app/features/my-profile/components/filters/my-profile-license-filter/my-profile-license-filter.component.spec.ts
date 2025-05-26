import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileLicenseFilterComponent } from './my-profile-license-filter.component';

describe('MyProfileLicenseFilterComponent', () => {
  let component: MyProfileLicenseFilterComponent;
  let fixture: ComponentFixture<MyProfileLicenseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileLicenseFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileLicenseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
