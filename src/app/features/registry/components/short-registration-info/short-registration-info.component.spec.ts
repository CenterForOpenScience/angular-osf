import { Store } from '@ngxs/store';

import { MockComponent } from 'ng-mocks';

import { of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ContributorsSelectors, LoadMoreBibliographicContributors } from '@osf/shared/stores/contributors';

import { RegistrationOverviewModel } from '../../models';

import { ShortRegistrationInfoComponent } from './short-registration-info.component';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ShortRegistrationInfoComponent', () => {
  let component: ShortRegistrationInfoComponent;
  let fixture: ComponentFixture<ShortRegistrationInfoComponent>;
  let store: Store;

  const mockRegistration: RegistrationOverviewModel = MOCK_REGISTRATION_OVERVIEW_MODEL;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortRegistrationInfoComponent, OSFTestingModule, MockComponent(ContributorsListComponent)],
      providers: [
        provideMockStore({
          signals: [
            { selector: ContributorsSelectors.getBibliographicContributors, value: signal([]) },
            { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: signal(false) },
            { selector: ContributorsSelectors.hasMoreBibliographicContributors, value: signal(false) },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShortRegistrationInfoComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.componentRef.setInput('registration', mockRegistration);
    fixture.detectChanges();
  });

  it('should receive registration input', () => {
    expect(component.registration()).toEqual(mockRegistration);
  });

  it('should compute associatedProjectUrl from registration and environment', () => {
    const environment = TestBed.inject(ENVIRONMENT);
    const expectedUrl = `${environment.webUrl}/${mockRegistration.associatedProjectId}`;

    expect(component.associatedProjectUrl()).toBe(expectedUrl);
  });

  it('should update associatedProjectUrl when registration changes', () => {
    const environment = TestBed.inject(ENVIRONMENT);
    const newRegistration: RegistrationOverviewModel = {
      ...mockRegistration,
      associatedProjectId: 'new-project-id',
    };

    fixture.componentRef.setInput('registration', newRegistration);
    fixture.detectChanges();

    expect(component.associatedProjectUrl()).toBe(`${environment.webUrl}/new-project-id`);
  });

  it('should have bibliographicContributors signal', () => {
    expect(component.bibliographicContributors).toBeDefined();
    expect(typeof component.bibliographicContributors).toBe('function');
  });

  it('should have isBibliographicContributorsLoading signal', () => {
    expect(component.isBibliographicContributorsLoading).toBeDefined();
    expect(typeof component.isBibliographicContributorsLoading).toBe('function');
  });

  it('should have hasMoreBibliographicContributors signal', () => {
    expect(component.hasMoreBibliographicContributors).toBeDefined();
    expect(typeof component.hasMoreBibliographicContributors).toBe('function');
  });

  it('should dispatch LoadMoreBibliographicContributors action with correct parameters', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue(of());
    const registrationId = 'test-registration-id';
    const registrationWithId: RegistrationOverviewModel = {
      ...mockRegistration,
      id: registrationId,
    };

    fixture.componentRef.setInput('registration', registrationWithId);
    fixture.detectChanges();

    component.handleLoadMoreContributors();

    expect(dispatchSpy).toHaveBeenCalledWith(
      new LoadMoreBibliographicContributors(registrationId, ResourceType.Registration)
    );
  });

  it('should be reactive to registration input changes', () => {
    const updatedRegistration: RegistrationOverviewModel = {
      ...mockRegistration,
      title: 'Updated Title',
      associatedProjectId: 'updated-project-id',
    };

    fixture.componentRef.setInput('registration', updatedRegistration);
    fixture.detectChanges();

    expect(component.registration().title).toBe('Updated Title');
    expect(component.registration().associatedProjectId).toBe('updated-project-id');
  });
});
