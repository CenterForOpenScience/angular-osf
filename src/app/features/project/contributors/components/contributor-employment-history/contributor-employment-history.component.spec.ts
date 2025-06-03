import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorEmploymentHistoryComponent } from './contributor-employment-history.component';

describe('ContributorEmploymentHistoryComponent', () => {
  let component: ContributorEmploymentHistoryComponent;
  let fixture: ComponentFixture<ContributorEmploymentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorEmploymentHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorEmploymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
