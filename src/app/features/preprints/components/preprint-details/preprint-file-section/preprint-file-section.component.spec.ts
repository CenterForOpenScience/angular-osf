import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintFileSectionComponent } from './preprint-file-section.component';

describe('PreprintFileSectionComponent', () => {
  let component: PreprintFileSectionComponent;
  let fixture: ComponentFixture<PreprintFileSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintFileSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintFileSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
