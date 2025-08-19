import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  CollectionsFilterChipsComponent,
  CollectionsFiltersComponent,
  CollectionsSearchResultsComponent,
} from '@osf/features/collections/components';
import { CollectionsState } from '@shared/stores';

import { CollectionsMainContentComponent } from './collections-main-content.component';

describe('CollectionsSearchComponent', () => {
  let component: CollectionsMainContentComponent;
  let fixture: ComponentFixture<CollectionsMainContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CollectionsMainContentComponent,
        ...MockComponents(
          CollectionsFilterChipsComponent,
          CollectionsFiltersComponent,
          CollectionsSearchResultsComponent
        ),
        MockPipe(TranslatePipe),
      ],
      providers: [provideStore([CollectionsState]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsMainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
