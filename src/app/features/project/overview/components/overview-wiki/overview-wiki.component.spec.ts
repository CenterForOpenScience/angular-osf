import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewWikiComponent } from './overview-wiki.component';

describe('ProjectWikiComponent', () => {
  let component: OverviewWikiComponent;
  let fixture: ComponentFixture<OverviewWikiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewWikiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
