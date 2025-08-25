import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleFilePickerComponent } from './google-file-picker.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('Component: Configure Addon', () => {
  let component: GoogleFilePickerComponent;
  let fixture: ComponentFixture<GoogleFilePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OSFTestingStoreModule, GoogleFilePickerComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleFilePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate the component', () => {
    expect(component).toBeTruthy();
  });
});
