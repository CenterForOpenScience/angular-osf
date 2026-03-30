import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriesComponent } from './registries.component';

describe('Component: Registries', () => {
  let fixture: ComponentFixture<RegistriesComponent>;
  let component: RegistriesComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegistriesComponent],
    });

    fixture = TestBed.createComponent(RegistriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
