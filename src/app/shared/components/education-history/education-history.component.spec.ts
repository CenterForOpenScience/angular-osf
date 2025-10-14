import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationHistoryComponent } from './education-history.component';

import { MOCK_EDUCATION } from '@testing/mocks';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('EducationHistoryComponent', () => {
  let component: EducationHistoryComponent;
  let fixture: ComponentFixture<EducationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationHistoryComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept education input', () => {
    const educationData = [MOCK_EDUCATION];
    fixture.componentRef.setInput('education', educationData);
    fixture.detectChanges();

    expect(component.education()).toEqual(educationData);
  });
});
