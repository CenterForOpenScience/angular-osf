import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { BehaviorSubject, of } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { WikiModel } from '@osf/shared/models/wiki/wiki.model';
import { LoaderService } from '@osf/shared/services/loader.service';
import { GetWikiList, WikiSelectors } from '@osf/shared/stores/wiki';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { LegacyWikiRedirectComponent } from './legacy-wiki-redirect.component';

describe('LegacyWikiRedirectComponent', () => {
  let fixture: ComponentFixture<LegacyWikiRedirectComponent>;
  let component: LegacyWikiRedirectComponent;
  let store: Store;
  let dispatchMock: Mock;
  let routerMock: RouterMockType;
  let loaderService: LoaderServiceMock;

  function setup(wikiList: WikiModel[] = [{ id: 'w1', name: 'Home', kind: 'wiki' }]) {
    const projectParams$ = new BehaviorSubject<Record<string, string>>({ id: 'p1' });
    const route = ActivatedRouteMockBuilder.create()
      .withParams({ wikiName: 'Home' })
      .withParentRoute({
        params: projectParams$.asObservable(),
        snapshot: { params: projectParams$.value } as Partial<ActivatedRoute['snapshot']>,
      } as Partial<ActivatedRoute>)
      .build();

    routerMock = RouterMockBuilder.create().build();
    loaderService = new LoaderServiceMock();

    TestBed.configureTestingModule({
      imports: [LegacyWikiRedirectComponent],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, route),
        MockProvider(Router, routerMock),
        MockProvider(LoaderService, loaderService),
        provideMockStore({
          signals: [{ selector: WikiSelectors.getWikiList, value: wikiList }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    dispatchMock = store.dispatch as Mock;
    dispatchMock.mockReturnValue(of(true));

    fixture = TestBed.createComponent(LegacyWikiRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should show loader and dispatch wiki list fetch with project id', () => {
    setup();

    expect(loaderService.show).toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalledWith(new GetWikiList(ResourceType.Project, 'p1'));
  });

  it('should navigate to wiki route with selected wiki guid and hide loader', () => {
    setup([{ id: 'wiki-guid', name: 'Home', kind: 'wiki' }]);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/p1/wiki'], {
      queryParams: { wiki: 'wiki-guid' },
      replaceUrl: true,
    });
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('should navigate with null wiki query param when name is not found', () => {
    setup([{ id: 'wiki-guid', name: 'Other', kind: 'wiki' }]);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/p1/wiki'], {
      queryParams: { wiki: null },
      replaceUrl: true,
    });
    expect(loaderService.hide).toHaveBeenCalled();
  });
});
