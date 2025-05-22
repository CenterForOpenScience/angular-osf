import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewComponentsComponent } from './overview-components.component';

describe('ProjectComponentsComponent', () => {
  let component: OverviewComponentsComponent;
  let fixture: ComponentFixture<OverviewComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewComponentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
