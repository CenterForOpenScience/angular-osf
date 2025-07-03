import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataStepComponent } from './metadata-step.component';

describe('MetadataComponent', () => {
  let component: MetadataStepComponent;
  let fixture: ComponentFixture<MetadataStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
