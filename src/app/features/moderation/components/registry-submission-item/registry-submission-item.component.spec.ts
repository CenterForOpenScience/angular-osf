import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrySubmissionItemComponent } from './registry-submission-item.component';

describe('RegistrySubmissionItemComponent', () => {
  let component: RegistrySubmissionItemComponent;
  let fixture: ComponentFixture<RegistrySubmissionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrySubmissionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrySubmissionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
