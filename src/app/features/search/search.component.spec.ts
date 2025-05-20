import { provideStore, Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFiltersState } from '@shared/components/resources/resource-filters/store';
import { ResourcesWrapperComponent } from '@shared/components/resources/resources-wrapper/resources-wrapper.component';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

import { SearchComponent } from './search.component';
import { SearchState } from './store';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, ...MockComponents(SearchInputComponent, ResourcesWrapperComponent)],
      providers: [
        provideStore([SearchState, ResourceFiltersState]),
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        { provide: IS_XSMALL, useValue: of(false) },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSignal').mockReturnValue(signal(''));
    jest.spyOn(store, 'dispatch').mockReturnValue(of(undefined));

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
