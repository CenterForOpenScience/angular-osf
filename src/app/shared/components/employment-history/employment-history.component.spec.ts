import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { EmploymentHistoryComponent } from './employment-history.component';

import { MOCK_EMPLOYMENT } from '@testing/mocks';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('EmploymentHistoryComponent', () => {
  let component: EmploymentHistoryComponent;
  let fixture: ComponentFixture<EmploymentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploymentHistoryComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EmploymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have employment input signal', () => {
    expect(component.employment).toBeDefined();
  });

  it('should display employment history when data is provided', () => {
    fixture.componentRef.setInput('employment', MOCK_EMPLOYMENT);
    fixture.detectChanges();

    const accordionPanels = fixture.debugElement.queryAll(By.css('p-accordion-panel'));
    expect(accordionPanels.length).toBe(MOCK_EMPLOYMENT.length);
  });

  it('should render employment information correctly', () => {
    fixture.componentRef.setInput('employment', [MOCK_EMPLOYMENT[0]]);
    fixture.detectChanges();

    const institutionElement = fixture.debugElement.query(By.css('p-accordion-header p'));
    expect(institutionElement.nativeElement.textContent).toContain(MOCK_EMPLOYMENT[0].institution);
  });
});
