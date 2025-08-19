import { TranslateModule } from '@ngx-translate/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MOCK_REVIEW } from '@shared/mocks';

import { RegistrationBlocksDataComponent } from './registration-blocks-data.component';

describe('RegistrationBlocksDataComponent', () => {
  let component: RegistrationBlocksDataComponent;
  let fixture: ComponentFixture<RegistrationBlocksDataComponent>;

  const mockReviewData = MOCK_REVIEW;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationBlocksDataComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationBlocksDataComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute updatedKeysMap correctly', () => {
    fixture.componentRef.setInput('updatedFields', ['question1', 'question3']);
    fixture.detectChanges();

    const expectedMap = { question1: true, question3: true };
    expect(component.updatedKeysMap()).toEqual(expectedMap);
  });

  it('should return empty object when updatedFields is empty', () => {
    fixture.componentRef.setInput('updatedFields', []);
    fixture.detectChanges();

    expect(component.updatedKeysMap()).toEqual({});
  });

  it('should handle single updated field', () => {
    fixture.componentRef.setInput('updatedFields', ['question1']);
    fixture.detectChanges();

    expect(component.updatedKeysMap()).toEqual({ question1: true });
  });

  it('should not show required error message on overview page', () => {
    fixture.componentRef.setInput('isOverviewPage', true);
    fixture.detectChanges();

    const errorMessages = fixture.debugElement.queryAll(By.css('p-message[severity="error"]'));
    expect(errorMessages.length).toBe(0);
  });

  it('should not show required error message when data is present', () => {
    fixture.componentRef.setInput('reviewData', mockReviewData);
    fixture.detectChanges();

    const errorMessages = fixture.debugElement.queryAll(By.css('p-message[severity="error"]'));
    expect(errorMessages.length).toBe(0);
  });
});
