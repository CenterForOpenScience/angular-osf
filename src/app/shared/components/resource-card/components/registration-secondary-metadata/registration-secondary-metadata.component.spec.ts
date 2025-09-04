import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSecondaryMetadataComponent } from './registration-secondary-metadata.component';

describe.skip('RegistrationSecondaryMetadataComponent', () => {
  let component: RegistrationSecondaryMetadataComponent;
  let fixture: ComponentFixture<RegistrationSecondaryMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationSecondaryMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationSecondaryMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
