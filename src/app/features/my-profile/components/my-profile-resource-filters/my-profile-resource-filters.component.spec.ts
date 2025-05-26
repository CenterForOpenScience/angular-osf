import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileResourceFiltersComponent } from './my-profile-resource-filters.component';

describe('MyProfileResourceFiltersComponent', () => {
  let component: MyProfileResourceFiltersComponent;
  let fixture: ComponentFixture<MyProfileResourceFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileResourceFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileResourceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
