import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SubjectsListComponent } from './subjects-list.component';

import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('SubjectsListComponent', () => {
  let component: SubjectsListComponent;
  let fixture: ComponentFixture<SubjectsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsListComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectsListComponent);
    component = fixture.componentInstance;
  });

  it('should have default input values', () => {
    expect(component.subjects()).toEqual([]);
    expect(component.isLoading()).toBe(false);
  });

  it('should set subjects input correctly', () => {
    fixture.componentRef.setInput('subjects', SUBJECTS_MOCK);
    expect(component.subjects()).toEqual(SUBJECTS_MOCK);
  });

  it('should set isLoading input correctly', () => {
    fixture.componentRef.setInput('isLoading', true);
    expect(component.isLoading()).toBe(true);
  });

  it('should render subjects when subjects array has items and isLoading is false', () => {
    fixture.componentRef.setInput('subjects', SUBJECTS_MOCK);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const tagElements = fixture.debugElement.queryAll(By.css('p-tag'));
    expect(tagElements.length).toBe(2);
  });

  it('should render none message when subjects array is empty and isLoading is false', () => {
    fixture.componentRef.setInput('subjects', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('p'));
    expect(messageElement).toBeTruthy();
    expect(messageElement.nativeElement.textContent).toContain('common.labels.none');
  });

  it('should show skeleton and not subjects when isLoading is true', () => {
    fixture.componentRef.setInput('subjects', SUBJECTS_MOCK);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const skeleton = fixture.debugElement.query(By.css('p-skeleton'));
    const tagElements = fixture.debugElement.queryAll(By.css('p-tag'));

    expect(skeleton).toBeTruthy();
    expect(tagElements.length).toBe(0);
  });
});
