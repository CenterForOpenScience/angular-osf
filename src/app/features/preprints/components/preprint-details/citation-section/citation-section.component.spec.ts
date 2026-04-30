import { Store } from '@ngxs/store';

import { SelectChangeEvent, SelectFilterEvent } from 'primeng/select';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceType } from '@shared/enums/resource-type.enum';
import {
  CitationsSelectors,
  FetchDefaultProviderCitationStyles,
  GetCitationStyles,
  GetStyledCitation,
} from '@shared/stores/citations';

import { CITATION_STYLES_MOCK } from '@testing/mocks/citation-style.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

import { CitationSectionComponent } from './citation-section.component';

describe('CitationSectionComponent', () => {
  let component: CitationSectionComponent;
  let fixture: ComponentFixture<CitationSectionComponent>;
  let store: Store;

  const mockCitationStyles = CITATION_STYLES_MOCK;
  const mockDefaultCitations = [{ id: 'apa', title: 'APA', citation: 'APA Citation Text' }];
  const mockStyledCitation = { citation: 'Styled Citation Text' };

  interface SetupOverrides extends BaseSetupOverrides {
    preprintId?: string;
    providerId?: string;
    detectChanges?: boolean;
  }

  function setup(overrides: SetupOverrides = {}) {
    TestBed.configureTestingModule({
      imports: [CitationSectionComponent],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: mergeSignalOverrides(
            [
              { selector: CitationsSelectors.getDefaultCitations, value: mockDefaultCitations },
              { selector: CitationsSelectors.getDefaultCitationsLoading, value: false },
              { selector: CitationsSelectors.getCitationStyles, value: mockCitationStyles },
              { selector: CitationsSelectors.getCitationStylesLoading, value: false },
              { selector: CitationsSelectors.getStyledCitation, value: mockStyledCitation },
            ],
            overrides.selectorOverrides
          ),
        }),
      ],
    });

    fixture = TestBed.createComponent(CitationSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.componentRef.setInput('preprintId', overrides.preprintId ?? 'test-preprint-id');
    fixture.componentRef.setInput('providerId', overrides.providerId ?? 'osf');

    if (overrides.detectChanges ?? true) {
      fixture.detectChanges();
      (store.dispatch as Mock).mockClear();
    }
  }

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should return signals directly from the store', () => {
    setup();
    expect(component.defaultCitations()).toBe(mockDefaultCitations);
    expect(component.citationStyles()).toBe(mockCitationStyles);
    expect(component.styledCitation()).toEqual(mockStyledCitation);
  });

  it('should map citation styles into select options', () => {
    setup();
    const citationStylesOptions = component.citationStylesOptions();
    expect(citationStylesOptions).toEqual(
      mockCitationStyles.map((style) => ({
        label: style.title,
        value: style,
      }))
    );
  });

  it('should return loading filter message when citation styles are loading', () => {
    setup({
      selectorOverrides: [{ selector: CitationsSelectors.getCitationStylesLoading, value: true }],
    });
    expect(component.filterMessage()).toBe('project.overview.metadata.citationLoadingPlaceholder');
  });

  it('should return empty-state filter message when citation styles are not loading', () => {
    setup();
    expect(component.filterMessage()).toBe('common.search.noResultsFound');
  });

  it('should dispatch FetchDefaultProviderCitationStyles on init with correct inputs', () => {
    setup({ detectChanges: false });
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(
      new FetchDefaultProviderCitationStyles(ResourceType.Preprint, 'test-preprint-id', 'osf')
    );
  });

  it('should dispatch GetStyledCitation when a style is selected', () => {
    setup();
    const mockEvent: SelectChangeEvent = {
      value: { id: 'style-1' },
      originalEvent: new Event('change'),
    };

    component.handleGetStyledCitation(mockEvent);

    expect(store.dispatch).toHaveBeenCalledWith(
      new GetStyledCitation(ResourceType.Preprint, 'test-preprint-id', 'style-1')
    );
  });

  it('should debounce and deduplicate citation style filter dispatches', () => {
    vi.useFakeTimers();
    setup();
    const preventDefault = vi.fn();
    const eventApa: SelectFilterEvent = {
      originalEvent: { preventDefault } as unknown as Event,
      filter: 'apa',
    };

    component.handleCitationStyleFilterSearch(eventApa);

    expect(preventDefault).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(store.dispatch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(store.dispatch).toHaveBeenCalledWith(new GetCitationStyles('apa'));
    expect(store.dispatch).toHaveBeenCalledTimes(1);

    (store.dispatch as Mock).mockClear();
    component.handleCitationStyleFilterSearch(eventApa);
    vi.advanceTimersByTime(300);
    expect(store.dispatch).not.toHaveBeenCalled();

    const eventMla: SelectFilterEvent = {
      originalEvent: { preventDefault: vi.fn() } as unknown as Event,
      filter: 'mla',
    };
    component.handleCitationStyleFilterSearch(eventMla);
    vi.advanceTimersByTime(300);

    expect(store.dispatch).toHaveBeenCalledWith(new GetCitationStyles('mla'));
  });
});
