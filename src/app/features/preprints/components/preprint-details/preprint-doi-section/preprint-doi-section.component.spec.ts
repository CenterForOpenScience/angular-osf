import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintDoiSectionComponent } from './preprint-doi-section.component';

describe.skip('PreprintDoiSectionComponent', () => {
  let component: PreprintDoiSectionComponent;
  let fixture: ComponentFixture<PreprintDoiSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintDoiSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintDoiSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
