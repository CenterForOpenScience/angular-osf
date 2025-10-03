import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewParentProjectComponent } from './overview-parent-project.component';

describe.skip('OverviewParentProjectComponent', () => {
  let component: OverviewParentProjectComponent;
  let fixture: ComponentFixture<OverviewParentProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewParentProjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewParentProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
