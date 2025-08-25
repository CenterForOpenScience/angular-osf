import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataciteTrackerComponent } from './datacite-tracker.component';

describe('DataciteTrackerComponent', () => {
  let component: DataciteTrackerComponent;
  let fixture: ComponentFixture<DataciteTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataciteTrackerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataciteTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
