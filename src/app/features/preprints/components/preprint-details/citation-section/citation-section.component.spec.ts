import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@shared/mocks';

import { CitationSectionComponent } from './citation-section.component';

describe.skip('CitationSectionComponent', () => {
  let component: CitationSectionComponent;
  let fixture: ComponentFixture<CitationSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationSectionComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
