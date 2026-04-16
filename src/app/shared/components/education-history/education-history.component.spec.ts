import { MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthYearPipe } from '@osf/shared/pipes/month-year.pipe';

import { MOCK_EDUCATION } from '@testing/mocks/user-employment-education.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { EducationHistoryComponent } from './education-history.component';

describe('EducationHistoryComponent', () => {
  let component: EducationHistoryComponent;
  let fixture: ComponentFixture<EducationHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EducationHistoryComponent, MockPipe(MonthYearPipe)],
      providers: [provideOSFCore()],
    });

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
