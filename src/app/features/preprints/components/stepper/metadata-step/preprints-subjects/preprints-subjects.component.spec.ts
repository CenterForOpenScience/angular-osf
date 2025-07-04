import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsSubjectsComponent } from './preprints-subjects.component';

describe('RegistriesSubjectsComponent', () => {
  let component: PreprintsSubjectsComponent;
  let fixture: ComponentFixture<PreprintsSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsSubjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
