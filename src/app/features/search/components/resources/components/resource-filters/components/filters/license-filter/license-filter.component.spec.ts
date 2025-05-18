import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseFilterComponent } from './license-filter.component';

describe('LicenseFilterComponent', () => {
  let component: LicenseFilterComponent;
  let fixture: ComponentFixture<LicenseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LicenseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
