import { provideStore } from '@ngxs/store';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchState } from '@osf/features/search/store';

import { ResourceFiltersState } from '../resource-filters/store';

import { FilterChipsComponent } from './filter-chips.component';

describe('FilterChipsComponent', () => {
  let component: FilterChipsComponent;
  let fixture: ComponentFixture<FilterChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterChipsComponent],
      providers: [provideStore([ResourceFiltersState, SearchState]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
