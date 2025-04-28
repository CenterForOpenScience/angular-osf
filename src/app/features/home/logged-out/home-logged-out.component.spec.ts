import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoggedOutComponent } from './home-logged-out.component';

describe('LoggedOutComponent', () => {
  let component: HomeLoggedOutComponent;
  let fixture: ComponentFixture<HomeLoggedOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLoggedOutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeLoggedOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
