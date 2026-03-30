import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { ResourceType } from '@shared/enums/resource-type.enum';
import {
  ContributorsSelectors,
  GetBibliographicContributors,
  LoadMoreBibliographicContributors,
  ResetContributorsState,
} from '@shared/stores/contributors';
import { FetchResourceInstitutions, InstitutionsSelectors } from '@shared/stores/institutions';

import { PreprintAuthorAssertionsComponent } from '../preprint-author-assertions/preprint-author-assertions.component';
import { PreprintDoiSectionComponent } from '../preprint-doi-section/preprint-doi-section.component';

import { GeneralInformationComponent } from './general-information.component';

import { MOCK_CONTRIBUTOR } from '@testing/mocks/contributors.mock';
import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { MockComponentWithSignal } from '@testing/providers/component-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

describe('GeneralInformationComponent', () => {
  let component: GeneralInformationComponent;
  let fixture: ComponentFixture<GeneralInformationComponent>;
  let store: Store;

  const mockContributors = [MOCK_CONTRIBUTOR];
  const mockInstitutions = [MOCK_INSTITUTION];
  const mockWebUrl = 'https://staging4.osf.io';

  interface SetupOverrides extends BaseSetupOverrides {
    platformId?: string;
  }

  function setup(overrides: SetupOverrides = {}) {
    TestBed.configureTestingModule({
      imports: [
        GeneralInformationComponent,
        ...MockComponents(
          AffiliatedInstitutionsViewComponent,
          ContributorsListComponent,
          IconComponent,
          PreprintDoiSectionComponent,
          PreprintAuthorAssertionsComponent
        ),
        MockComponentWithSignal('osf-truncated-text'),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ENVIRONMENT, { webUrl: mockWebUrl }),
        MockProvider(PLATFORM_ID, overrides.platformId ?? 'browser'),
        provideMockStore({
          signals: mergeSignalOverrides(
            [
              { selector: PreprintSelectors.getPreprint, value: PREPRINT_MOCK },
              { selector: PreprintSelectors.isPreprintLoading, value: false },
              { selector: ContributorsSelectors.getBibliographicContributors, value: mockContributors },
              { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
              { selector: ContributorsSelectors.hasMoreBibliographicContributors, value: false },
              { selector: InstitutionsSelectors.getResourceInstitutions, value: mockInstitutions },
            ],
            overrides.selectorOverrides
          ),
        }),
      ],
    });

    fixture = TestBed.createComponent(GeneralInformationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.componentRef.setInput('preprintProvider', PREPRINT_PROVIDER_DETAILS_MOCK);
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should expose preprint, contributors, institutions and computed link', () => {
    setup();
    expect(component.preprint()).toBe(PREPRINT_MOCK);
    expect(component.bibliographicContributors()).toBe(mockContributors);
    expect(component.affiliatedInstitutions()).toBe(mockInstitutions);
    expect(component.nodeLink()).toBe(`${mockWebUrl}/node-123`);
    expect(component.preprintProvider()).toBe(PREPRINT_PROVIDER_DETAILS_MOCK);
  });

  it('should have skeleton data array with 5 null elements', () => {
    setup();
    expect(component.skeletonData).toHaveLength(5);
    expect(component.skeletonData.every((item) => item === null)).toBe(true);
  });

  it('should dispatch constructor effect actions when preprint id exists', () => {
    setup();
    fixture.detectChanges();
    TestBed.flushEffects();
    expect(store.dispatch).toHaveBeenCalledWith(
      new GetBibliographicContributors(PREPRINT_MOCK.id, ResourceType.Preprint)
    );
    expect(store.dispatch).toHaveBeenCalledWith(new FetchResourceInstitutions(PREPRINT_MOCK.id, ResourceType.Preprint));
  });

  it('should not dispatch constructor effect actions when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintSelectors.getPreprint, value: undefined }],
    });
    (store.dispatch as jest.Mock).mockClear();
    fixture.detectChanges();
    TestBed.flushEffects();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch load more contributors with preprint id', () => {
    setup();
    (store.dispatch as jest.Mock).mockClear();
    component.handleLoadMoreContributors();
    expect(store.dispatch).toHaveBeenCalledWith(
      new LoadMoreBibliographicContributors(PREPRINT_MOCK.id, ResourceType.Preprint)
    );
  });

  it('should dispatch load more contributors with undefined id when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintSelectors.getPreprint, value: undefined }],
    });
    (store.dispatch as jest.Mock).mockClear();
    component.handleLoadMoreContributors();
    expect(store.dispatch).toHaveBeenCalledWith(
      new LoadMoreBibliographicContributors(undefined, ResourceType.Preprint)
    );
  });

  it('should reset contributors state on destroy in browser', () => {
    setup({ platformId: 'browser' });
    (store.dispatch as jest.Mock).mockClear();
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(new ResetContributorsState());
  });

  it('should not reset contributors state on destroy in server platform', () => {
    setup({ platformId: 'server' });
    (store.dispatch as jest.Mock).mockClear();
    component.ngOnDestroy();
    expect(store.dispatch).not.toHaveBeenCalledWith(new ResetContributorsState());
  });
});
