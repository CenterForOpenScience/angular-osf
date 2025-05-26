import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileResourcesComponent } from './my-profile-resources.component';

describe('MyProfileResourcesComponent', () => {
  let component: MyProfileResourcesComponent;
  let fixture: ComponentFixture<MyProfileResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileResourcesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
