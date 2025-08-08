import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationSectionComponent } from './citation-section.component';

describe('CitationSectionComponent', () => {
  let component: CitationSectionComponent;
  let fixture: ComponentFixture<CitationSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
