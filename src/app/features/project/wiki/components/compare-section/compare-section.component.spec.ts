import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareSectionComponent } from './compare-section.component';

describe('CompareSectionComponent', () => {
  let component: CompareSectionComponent;
  let fixture: ComponentFixture<CompareSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompareSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
