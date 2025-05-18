import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileResourceTypeFilterComponent } from './my-profile-resource-type-filter.component';

describe('MyProfileResourceTypeFilterComponent', () => {
  let component: MyProfileResourceTypeFilterComponent;
  let fixture: ComponentFixture<MyProfileResourceTypeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileResourceTypeFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileResourceTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
