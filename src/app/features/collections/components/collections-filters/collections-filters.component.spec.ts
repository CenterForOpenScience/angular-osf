import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsState } from '@shared/stores';

import { CollectionsFiltersComponent } from './collections-filters.component';

describe('CollectionsFiltersComponent', () => {
  let component: CollectionsFiltersComponent;
  let fixture: ComponentFixture<CollectionsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsFiltersComponent, MockPipe(TranslatePipe)],
      providers: [provideStore([CollectionsState]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
