import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriesComponent } from './registries.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Component: Registries', () => {
  let fixture: ComponentFixture<RegistriesComponent>;
  let component: RegistriesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistriesComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
