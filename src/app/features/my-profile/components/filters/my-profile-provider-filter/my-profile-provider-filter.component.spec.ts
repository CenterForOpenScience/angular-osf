import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileProviderFilterComponent } from './my-profile-provider-filter.component';

describe('MyProfileProviderFilterComponent', () => {
  let component: MyProfileProviderFilterComponent;
  let fixture: ComponentFixture<MyProfileProviderFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileProviderFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileProviderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
