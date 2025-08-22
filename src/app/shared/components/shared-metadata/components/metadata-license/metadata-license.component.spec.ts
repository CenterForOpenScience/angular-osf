import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataLicenseComponent } from './metadata-license.component';

describe('MetadataLicenseComponent', () => {
  let component: MetadataLicenseComponent;
  let fixture: ComponentFixture<MetadataLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataLicenseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
