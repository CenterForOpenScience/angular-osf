import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewCollectionsComponent } from './overview-collections.component';

describe('OverviewCollectionsComponent', () => {
  let component: OverviewCollectionsComponent;
  let fixture: ComponentFixture<OverviewCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewCollectionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
