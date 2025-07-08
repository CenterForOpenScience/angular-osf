import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInstitutionsComponent } from './admin-institutions.component';

describe('AdminInstitutionsComponent', () => {
  let component: AdminInstitutionsComponent;
  let fixture: ComponentFixture<AdminInstitutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInstitutionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
