import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionsRegistrationsComponent } from './institutions-registrations.component';

describe('InstitutionsRegistrationsComponent', () => {
  let component: InstitutionsRegistrationsComponent;
  let fixture: ComponentFixture<InstitutionsRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionsRegistrationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
