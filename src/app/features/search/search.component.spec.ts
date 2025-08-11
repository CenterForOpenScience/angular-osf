import { provideStore, Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  FilterChipsComponent,
  ReusableFilterComponent,
  SearchHelpTutorialComponent,
  SearchInputComponent,
  SearchResultsContainerComponent,
} from '@osf/shared/components';

import { SearchComponent } from './search.component';
import { SearchState } from './store';

describe.skip('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchComponent,
        ...MockComponents(
          SearchInputComponent,
          SearchHelpTutorialComponent,
          ReusableFilterComponent,
          SearchResultsContainerComponent,
          FilterChipsComponent
        ),
      ],
      providers: [provideStore([SearchState]), provideHttpClient(withFetch()), provideHttpClientTesting()],
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
