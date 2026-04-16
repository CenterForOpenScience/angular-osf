import { Store } from '@ngxs/store';

import { MockComponent } from 'ng-mocks';

import { of } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ContributorsSelectors, LoadMoreBibliographicContributors } from '@osf/shared/stores/contributors';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { ShortRegistrationInfoComponent } from './short-registration-info.component';

describe('ShortRegistrationInfoComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShortRegistrationInfoComponent, MockComponent(ContributorsListComponent)],
      providers: [
        provideOSFCore(),
        provideRouter([]),
        provideMockStore({
          signals: [
            { selector: ContributorsSelectors.getBibliographicContributors, value: [] },
            { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
            { selector: ContributorsSelectors.hasMoreBibliographicContributors, value: false },
          ],
        }),
      ],
    });
  });

  it('should create and compute associatedProjectUrl', () => {
    const fixture = TestBed.createComponent(ShortRegistrationInfoComponent);
    fixture.componentRef.setInput('registration', MOCK_REGISTRATION_OVERVIEW_MODEL);
    fixture.detectChanges();

    const environment = TestBed.inject(ENVIRONMENT);
    const expectedUrl = `${environment.webUrl}/${MOCK_REGISTRATION_OVERVIEW_MODEL.associatedProjectId}`;

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.associatedProjectUrl()).toBe(expectedUrl);
  });

  it('should dispatch LoadMoreBibliographicContributors', () => {
    const fixture = TestBed.createComponent(ShortRegistrationInfoComponent);
    fixture.componentRef.setInput('registration', MOCK_REGISTRATION_OVERVIEW_MODEL);
    fixture.detectChanges();

    const store = TestBed.inject(Store);
    vi.spyOn(store, 'dispatch').mockReturnValue(of(undefined));

    fixture.componentInstance.handleLoadMoreContributors();

    expect(store.dispatch).toHaveBeenCalledWith(
      new LoadMoreBibliographicContributors(MOCK_REGISTRATION_OVERVIEW_MODEL.id, ResourceType.Registration)
    );
  });
});
