import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { SubjectsSelectors } from '@osf/shared/stores/subjects';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

import { CitationSectionComponent } from '../citation-section/citation-section.component';

import { AdditionalInfoComponent } from './additional-info.component';

describe('AdditionalInfoComponent', () => {
  let component: AdditionalInfoComponent;
  let fixture: ComponentFixture<AdditionalInfoComponent>;
  let store: Store;

  interface SetupOverrides extends BaseSetupOverrides {
    preprintProviderId?: string;
  }

  function setup(overrides: SetupOverrides = {}) {
    TestBed.configureTestingModule({
      imports: [AdditionalInfoComponent, ...MockComponents(CitationSectionComponent, LicenseDisplayComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: mergeSignalOverrides(
            [
              { selector: PreprintSelectors.getPreprint, value: PREPRINT_MOCK },
              { selector: PreprintSelectors.isPreprintLoading, value: false },
              { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
              { selector: SubjectsSelectors.areSelectedSubjectsLoading, value: false },
            ],
            overrides.selectorOverrides
          ),
        }),
      ],
    });

    fixture = TestBed.createComponent(AdditionalInfoComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.componentRef.setInput('preprintProviderId', overrides.preprintProviderId ?? 'osf');
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should return license from preprint when available', () => {
    setup();
    const license = component.license();
    expect(license).toBe(PREPRINT_MOCK.embeddedLicense);
  });

  it('should return license options record from preprint when available', () => {
    setup();
    const licenseOptionsRecord = component.licenseOptionsRecord();
    expect(licenseOptionsRecord).toEqual(PREPRINT_MOCK.licenseOptions);
  });

  it('should have skeleton data array with 5 null elements', () => {
    setup();
    expect(component.skeletonData).toHaveLength(5);
    expect(component.skeletonData.every((item) => item === null)).toBe(true);
  });

  it('should navigate to search page with tag when tagClicked is called', () => {
    setup();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.tagClicked('test-tag');

    expect(navigateSpy).toHaveBeenCalledWith(['/search'], {
      queryParams: { search: 'test-tag' },
    });
  });

  it('should not render DOI link when articleDoiLink is missing', () => {
    setup();
    const doiLink = fixture.nativeElement.querySelector('a[href*="doi.org"]');
    expect(doiLink).toBeNull();
  });

  it('should render DOI link when articleDoiLink is available', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintSelectors.getPreprint,
          value: {
            ...PREPRINT_MOCK,
            articleDoiLink: 'https://doi.org/10.1234/sample.article-doi',
          },
        },
      ],
    });

    const doiLink = fixture.nativeElement.querySelector('a[href*="doi.org"]') as HTMLAnchorElement | null;
    expect(doiLink).not.toBeNull();
    expect(doiLink?.getAttribute('href')).toBe('https://doi.org/10.1234/sample.article-doi');
    expect(doiLink?.textContent?.trim()).toBe('https://doi.org/10.1234/sample.article-doi');
  });

  it('should not dispatch subject fetch when preprint id is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintSelectors.getPreprint, value: null }],
    });

    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
