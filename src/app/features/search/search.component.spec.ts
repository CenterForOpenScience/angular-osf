import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { SEARCH_TAB_OPTIONS } from '@osf/shared/constants/search-tab-options.const';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchComponent, MockComponent(GlobalSearchComponent)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchTabOptions with SEARCH_TAB_OPTIONS', () => {
    expect(component.searchTabOptions).toEqual(SEARCH_TAB_OPTIONS);
  });

  it('should render template with correct structure', () => {
    const hostElement = fixture.debugElement.nativeElement;
    const containerDiv = hostElement.querySelector('div.mt-6.pt-5');
    expect(containerDiv).toBeTruthy();

    const globalSearch = containerDiv.querySelector('osf-global-search');
    expect(globalSearch).toBeTruthy();
  });
});
