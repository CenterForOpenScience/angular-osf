import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriesLandingComponent } from './registries-landing.component';

describe('RegistriesLandingComponent', () => {
  let component: RegistriesLandingComponent;
  let fixture: ComponentFixture<RegistriesLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistriesLandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
