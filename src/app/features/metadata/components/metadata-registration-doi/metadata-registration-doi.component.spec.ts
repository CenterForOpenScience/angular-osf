import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@osf/shared/mocks';

import { MetadataRegistrationDoiComponent } from './metadata-registration-doi.component';

describe('MetadataRegistrationDoiComponent', () => {
  let component: MetadataRegistrationDoiComponent;
  let fixture: ComponentFixture<MetadataRegistrationDoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataRegistrationDoiComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataRegistrationDoiComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
