import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDuplicatesComponent } from './view-duplicates.component';

describe.skip('ViewForksComponent', () => {
  let component: ViewDuplicatesComponent;
  let fixture: ComponentFixture<ViewDuplicatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDuplicatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDuplicatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
