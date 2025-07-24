import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationPreviewComponent } from './citation-preview.component';

describe('CitationPreviewComponent', () => {
  let component: CitationPreviewComponent;
  let fixture: ComponentFixture<CitationPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
