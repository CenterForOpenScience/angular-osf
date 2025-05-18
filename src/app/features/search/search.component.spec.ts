import { NgxsModule, Store } from '@ngxs/store';

import { of } from 'rxjs';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesWrapperComponent } from '@osf/features/search/components/resources/components/resources-wrapper/resources-wrapper.component';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

import { SearchComponent } from './search.component';
import { SearchState } from './store';

import { MockComponent } from 'ng-mocks';
import { ResourceFiltersState } from 'src/app/features/search/components/resources/components/resource-filters/store';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, NgxsModule.forRoot([SearchState, ResourceFiltersState])],
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        { provide: IS_XSMALL, useValue: of(false) },
      ],
    })
      .overrideComponent(SearchComponent, {
        remove: {
          imports: [SearchInputComponent, ResourcesWrapperComponent],
        },
        add: {
          imports: [MockComponent(SearchInputComponent), MockComponent(ResourcesWrapperComponent)],
        },
      })
      .compileComponents();

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
