import { provideStore } from '@ngxs/store';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsState } from '@shared/stores';

import { CollectionsFilterChipsComponent } from './collections-filter-chips.component';

describe('CollectionsFilterChipsComponent', () => {
  let component: CollectionsFilterChipsComponent;
  let fixture: ComponentFixture<CollectionsFilterChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsFilterChipsComponent],
      providers: [provideStore([CollectionsState]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsFilterChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
