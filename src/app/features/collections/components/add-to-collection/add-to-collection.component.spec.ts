import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { CollectionMetadataStepComponent } from '@osf/features/collections/components/add-to-collection/collection-metadata-step/collection-metadata-step.component';
import { ProjectContributorsStepComponent } from '@osf/features/collections/components/add-to-collection/project-contributors-step/project-contributors-step.component';
import { ProjectMetadataStepComponent } from '@osf/features/collections/components/add-to-collection/project-metadata-step/project-metadata-step.component';
import { SelectProjectStepComponent } from '@osf/features/collections/components/add-to-collection/select-project-step/select-project-step.component';
import { LoadingSpinnerComponent } from '@shared/components';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { CollectionsSelectors } from '@shared/stores';
import { ProjectsSelectors } from '@shared/stores/projects/projects.selectors';

import { AddToCollectionComponent } from './add-to-collection.component';

describe('AddToCollectionFormComponent', () => {
  let component: AddToCollectionComponent;
  let fixture: ComponentFixture<AddToCollectionComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case CollectionsSelectors.getCollectionProviderLoading:
          return () => false;
        case CollectionsSelectors.getCollectionProvider:
          return () => null;
        case ProjectsSelectors.getSelectedProject:
          return () => null;
        case UserSelectors.getCurrentUser:
          return () => null;
        default:
          return () => null;
      }
    });
    await TestBed.configureTestingModule({
      imports: [
        AddToCollectionComponent,
        ...MockComponents(
          LoadingSpinnerComponent,
          SelectProjectStepComponent,
          ProjectMetadataStepComponent,
          ProjectContributorsStepComponent,
          CollectionMetadataStepComponent
        ),
        MockPipe(TranslatePipe),
      ],
      providers: [
        TranslateServiceMock,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        [MockProvider(Store, MOCK_STORE)],
        MockProvider(Router),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddToCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
