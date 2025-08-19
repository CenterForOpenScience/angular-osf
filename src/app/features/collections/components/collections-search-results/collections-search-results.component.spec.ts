import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsSearchResultCardComponent } from '@osf/features/collections/components';
import { CustomPaginatorComponent } from '@shared/components';
import { CollectionsState } from '@shared/stores';

import { CollectionsSearchResultsComponent } from './collections-search-results.component';

describe('CollectionsResultsComponent', () => {
  let component: CollectionsSearchResultsComponent;
  let fixture: ComponentFixture<CollectionsSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CollectionsSearchResultsComponent,
        ...MockComponents(CustomPaginatorComponent, CollectionsSearchResultCardComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [provideStore([CollectionsState]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
