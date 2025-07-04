import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseComponent } from '@shared/components';

describe('LicenseComponent', () => {
  let component: LicenseComponent;
  let fixture: ComponentFixture<LicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
