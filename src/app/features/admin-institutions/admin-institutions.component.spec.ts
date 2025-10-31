import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';

import { AdminInstitutionsComponent } from './admin-institutions.component';
import { AdminInstitutionResourceTab } from './enums';
import { InstitutionsAdminSelectors } from './store';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AdminInstitutionsComponent', () => {
  let component: AdminInstitutionsComponent;
  let fixture: ComponentFixture<AdminInstitutionsComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let store: jest.Mocked<Store>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().build();
    mockRouter = RouterMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        AdminInstitutionsComponent,
        OSFTestingModule,
        ...MockComponents(LoadingSpinnerComponent, SelectComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: [
            { selector: InstitutionsAdminSelectors.getInstitution, value: MOCK_INSTITUTION },
            { selector: InstitutionsAdminSelectors.getInstitutionLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminInstitutionsComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    store.dispatch = jest.fn().mockReturnValue(of(undefined));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize resourceTabOptions', () => {
    expect(component.resourceTabOptions).toBeDefined();
    expect(component.resourceTabOptions.length).toBeGreaterThan(0);
  });

  it('should initialize selectedTab to Summary by default', () => {
    expect(component.selectedTab).toBe(AdminInstitutionResourceTab.Summary);
  });
});
