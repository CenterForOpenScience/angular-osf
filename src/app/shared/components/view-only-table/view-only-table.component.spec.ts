import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOnlyTableComponent } from './view-only-table.component';

describe('ViewOnlyTableComponent', () => {
  let component: ViewOnlyTableComponent;
  let fixture: ComponentFixture<ViewOnlyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOnlyTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOnlyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
