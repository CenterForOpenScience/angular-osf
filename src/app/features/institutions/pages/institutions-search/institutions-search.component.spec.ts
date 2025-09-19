import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SetDefaultFilterValue } from '@osf/shared/stores/global-search';
import { FetchInstitutionById, InstitutionsSearchSelectors } from '@osf/shared/stores/institutions-search';
import { GlobalSearchComponent, LoadingSpinnerComponent } from '@shared/components';
import { MOCK_INSTITUTION } from '@shared/mocks';

import { InstitutionsSearchComponent } from './institutions-search.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe.skip('InstitutionsSearchComponent', () => {
  let component: InstitutionsSearchComponent;
  let fixture: ComponentFixture<InstitutionsSearchComponent>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let store: jest.Mocked<Store>;

  beforeEach(async () => {
    activatedRouteMock = ActivatedRouteMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        InstitutionsSearchComponent,
        ...MockComponents(LoadingSpinnerComponent, GlobalSearchComponent),
        OSFTestingModule,
      ],
      providers: [
        MockProvider(ActivatedRoute, activatedRouteMock),
        provideMockStore({
          signals: [
            { selector: InstitutionsSearchSelectors.getInstitution, value: MOCK_INSTITUTION },
            { selector: InstitutionsSearchSelectors.getInstitutionLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsSearchComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    store.dispatch = jest.fn().mockReturnValue(of(undefined));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch institution and set default filter value on ngOnInit when institution-id is provided', () => {
    activatedRouteMock.snapshot!.params = { 'institution-id': MOCK_INSTITUTION.id };

    store.dispatch.mockReturnValue(of(undefined));

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(new FetchInstitutionById(MOCK_INSTITUTION.id));
    expect(store.dispatch).toHaveBeenCalledWith(
      new SetDefaultFilterValue('affiliation', MOCK_INSTITUTION.iris.join(','))
    );
  });

  it('should not fetch institution on ngOnInit when institution-id is not provided', () => {
    activatedRouteMock.snapshot!.params = {};

    component.ngOnInit();

    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
