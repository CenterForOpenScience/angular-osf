import { Store } from '@ngxs/store';

import { MockComponent } from 'ng-mocks';

import { of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSearchComponent } from '@osf/shared/components';

import { SearchComponent } from './search.component';

describe.skip('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, MockComponent(GlobalSearchComponent)],
      providers: [],
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
