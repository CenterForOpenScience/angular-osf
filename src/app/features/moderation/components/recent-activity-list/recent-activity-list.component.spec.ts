import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentActivityListComponent } from './recent-activity-list.component';

describe('RecentActivityListComponent', () => {
  let component: RecentActivityListComponent;
  let fixture: ComponentFixture<RecentActivityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentActivityListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
