import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { ResourceType } from '@shared/enums/resource-type.enum';
import {
  ContributorsSelectors,
  GetBibliographicContributors,
  LoadMoreBibliographicContributors,
  ResetContributorsState,
} from '@shared/stores/contributors';
import { FetchSelectedSubjects, SubjectsSelectors } from '@shared/stores/subjects';

import { PreprintDoiSectionComponent } from '../preprint-doi-section/preprint-doi-section.component';

import { PreprintTombstoneComponent } from './preprint-tombstone.component';

import { MOCK_CONTRIBUTOR } from '@testing/mocks/contributors.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { MockComponentWithSignal } from '@testing/providers/component-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintTombstoneComponent', () => {
  let component: PreprintTombstoneComponent;
  let fixture: ComponentFixture<PreprintTombstoneComponent>;
  let store: Store;
  let mockRouter: RouterMockType;

  const mockPreprint = PREPRINT_MOCK;
  const mockProvider = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockContributors = [MOCK_CONTRIBUTOR];
  const mockSubjects = SUBJECTS_MOCK;

  interface SetupOverrides extends BaseSetupOverrides {
    platformId?: 'browser' | 'server';
  }

  function setup(overrides: SetupOverrides = {}) {
    mockRouter = RouterMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [
        PreprintTombstoneComponent,
        ...MockComponents(ContributorsListComponent, LicenseDisplayComponent, PreprintDoiSectionComponent),
        MockComponentWithSignal('osf-truncated-text'),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(PLATFORM_ID, overrides.platformId ?? 'browser'),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: mergeSignalOverrides(
            [
              { selector: PreprintSelectors.getPreprint, value: mockPreprint },
              { selector: PreprintSelectors.isPreprintLoading, value: false },
              { selector: ContributorsSelectors.getBibliographicContributors, value: mockContributors },
              { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
              { selector: ContributorsSelectors.hasMoreBibliographicContributors, value: false },
              { selector: SubjectsSelectors.getSelectedSubjects, value: mockSubjects },
              { selector: SubjectsSelectors.areSelectedSubjectsLoading, value: false },
            ],
            overrides.selectorOverrides
          ),
        }),
      ],
    });

    fixture = TestBed.createComponent(PreprintTombstoneComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.componentRef.setInput('preprintProvider', mockProvider);
    (store.dispatch as jest.Mock).mockClear();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should expose selectors and computed values', () => {
    setup();
    expect(component.preprint()).toBe(mockPreprint);
    expect(component.bibliographicContributors()).toBe(mockContributors);
    expect(component.subjects()).toBe(mockSubjects);
    expect(component.license()).toBe(mockPreprint.embeddedLicense);
    expect(component.licenseOptionsRecord()).toEqual(mockPreprint.licenseOptions);
  });

  it('should fallback computed values when preprint data is missing', () => {
    setup({ selectorOverrides: [{ selector: PreprintSelectors.getPreprint, value: null }] });
    expect(component.license()).toBeNull();
    expect(component.licenseOptionsRecord()).toEqual({});
  });

  it('should expose preprint provider input and skeleton data', () => {
    setup();
    expect(component.preprintProvider()).toBe(mockProvider);
    expect(component.skeletonData).toHaveLength(6);
  });

  it('should emit preprintVersionSelected when version is selected', () => {
    setup();
    const emitSpy = jest.spyOn(component.preprintVersionSelected, 'emit');
    component.preprintVersionSelected.emit('version-1');
    expect(emitSpy).toHaveBeenCalledWith('version-1');
  });

  it('should dispatch contributor and subject fetch actions when preprint id exists', () => {
    setup();
    fixture.detectChanges();
    TestBed.flushEffects();
    expect(store.dispatch).toHaveBeenCalledWith(
      new GetBibliographicContributors(mockPreprint.id, ResourceType.Preprint)
    );
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSelectedSubjects(mockPreprint.id, ResourceType.Preprint));
  });

  it('should not dispatch contributor and subject fetch actions when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintSelectors.getPreprint, value: undefined }],
    });
    fixture.detectChanges();
    TestBed.flushEffects();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetBibliographicContributors));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchSelectedSubjects));
  });

  it('should dispatch load more contributors action', () => {
    setup();
    component.loadMoreContributors();
    expect(store.dispatch).toHaveBeenCalledWith(
      new LoadMoreBibliographicContributors(mockPreprint.id, ResourceType.Preprint)
    );
  });

  it('should navigate on tag click', () => {
    setup();
    component.tagClicked('biology');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { search: 'biology' } });
  });

  it('should reset contributors state on destroy', () => {
    setup();
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(new ResetContributorsState());
  });

  it('should not reset contributors state on destroy when not in browser', () => {
    setup({ platformId: 'server' });
    component.ngOnDestroy();
    expect(store.dispatch).not.toHaveBeenCalledWith(new ResetContributorsState());
  });
});
