import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationStyle } from '@osf/shared/models/citations/citation-style.model';
import { CitationsSelectors } from '@osf/shared/stores/citations';

import { CitationSectionComponent } from './citation-section.component';

import { CITATION_STYLES_MOCK } from '@testing/mocks/citation-style.mock';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('CitationSectionComponent', () => {
  let component: CitationSectionComponent;
  let fixture: ComponentFixture<CitationSectionComponent>;

  const mockCitationStyles: CitationStyle[] = CITATION_STYLES_MOCK;
  const mockDefaultCitations = {
    apa: 'APA Citation Text',
    mla: 'MLA Citation Text',
  };
  const mockStyledCitation = 'Styled Citation Text';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationSectionComponent, OSFTestingModule],
      providers: [
        TranslationServiceMock,
        provideMockStore({
          signals: [
            {
              selector: CitationsSelectors.getDefaultCitations,
              value: mockDefaultCitations,
            },
            {
              selector: CitationsSelectors.getDefaultCitationsLoading,
              value: false,
            },
            {
              selector: CitationsSelectors.getCitationStyles,
              value: mockCitationStyles,
            },
            {
              selector: CitationsSelectors.getCitationStylesLoading,
              value: false,
            },
            {
              selector: CitationsSelectors.getStyledCitation,
              value: mockStyledCitation,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationSectionComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('preprintId', 'test-preprint-id');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return default citations from store', () => {
    const defaultCitations = component.defaultCitations();
    expect(defaultCitations).toBe(mockDefaultCitations);
  });

  it('should return citation styles from store', () => {
    const citationStyles = component.citationStyles();
    expect(citationStyles).toBe(mockCitationStyles);
  });

  it('should return styled citation from store', () => {
    const styledCitation = component.styledCitation();
    expect(styledCitation).toBe(mockStyledCitation);
  });

  it('should have citation styles options signal', () => {
    const citationStylesOptions = component.citationStylesOptions();
    expect(citationStylesOptions).toBeDefined();
    expect(Array.isArray(citationStylesOptions)).toBe(true);
  });

  it('should handle citation style filter search', () => {
    const mockEvent = {
      originalEvent: new Event('input'),
      filter: 'test filter',
    };

    expect(() => component.handleCitationStyleFilterSearch(mockEvent)).not.toThrow();
  });

  it('should handle get styled citation', () => {
    const mockEvent = {
      value: { id: 'style-1' },
      originalEvent: new Event('change'),
    };

    expect(() => component.handleGetStyledCitation(mockEvent)).not.toThrow();
  });
});
