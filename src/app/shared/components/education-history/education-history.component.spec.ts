import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { MOCK_EDUCATION, TranslateServiceMock } from '@shared/mocks';

import { EducationHistoryComponent } from './education-history.component';

describe('EducationHistoryComponent', () => {
  let component: EducationHistoryComponent;
  let fixture: ComponentFixture<EducationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationHistoryComponent],
      providers: [TranslateServiceMock, provideNoopAnimations()],
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
