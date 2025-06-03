import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorEducationHistoryComponent } from './contributor-education-history.component';

describe('ContributorEducationHistoryComponent', () => {
  let component: ContributorEducationHistoryComponent;
  let fixture: ComponentFixture<ContributorEducationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorEducationHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorEducationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
