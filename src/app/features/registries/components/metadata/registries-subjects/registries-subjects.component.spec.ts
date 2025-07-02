import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriesSubjectsComponent } from './registries-subjects.component';

describe('RegistriesSubjectsComponent', () => {
  let component: RegistriesSubjectsComponent;
  let fixture: ComponentFixture<RegistriesSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistriesSubjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
