import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseBySubjectsComponent } from './browse-by-subjects.component';

describe('BrowseBySubjectsComponent', () => {
  let component: BrowseBySubjectsComponent;
  let fixture: ComponentFixture<BrowseBySubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseBySubjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrowseBySubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
