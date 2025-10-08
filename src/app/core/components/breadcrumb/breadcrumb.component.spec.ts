import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { ProviderSelectors } from '@core/store/provider';
import { InstitutionsAdminSelectors } from '@osf/features/admin-institutions/store';
import { InstitutionsSearchSelectors } from '@shared/stores/institutions-search';

import { BreadcrumbComponent } from './breadcrumb.component';

import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: Breadcrumb', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  const mockRouter = {
    url: '/test/path',
    events: of(new NavigationEnd(1, '/test/path', '/test/path')),
  };

  const mockActivatedRoute = {
    root: {
      snapshot: {
        url: [],
        params: {},
        data: {},
        firstChild: null,
      },
    },
    snapshot: {
      data: { skipBreadcrumbs: false },
      url: [],
      params: {},
    },
    firstChild: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        MockProvider(Router, mockRouter),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideMockStore({
          signals: [
            { selector: ProviderSelectors.getCurrentProvider, value: null },
            { selector: InstitutionsSearchSelectors.getInstitution, value: null },
            { selector: InstitutionsAdminSelectors.getInstitution, value: null },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show breadcrumb when skipBreadcrumbs is false', () => {
    expect(component.showBreadcrumb()).toBe(true);
  });

  it('should build breadcrumbs from route', () => {
    expect(component.breadcrumbs()).toBeDefined();
    expect(Array.isArray(component.breadcrumbs())).toBe(true);
  });
});
