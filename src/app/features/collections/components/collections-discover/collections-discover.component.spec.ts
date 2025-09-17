import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SENTRY_TOKEN } from '@core/factory/sentry.factory';
import { CollectionsMainContentComponent } from '@osf/features/collections/components';
import { CollectionsSearchResultCardComponent } from '@osf/features/collections/components/collections-search-result-card/collections-search-result-card.component';
import { LoadingSpinnerComponent, SearchInputComponent } from '@shared/components';
import { TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';
import { CollectionsState } from '@shared/stores';

import { CollectionsDiscoverComponent } from './collections-discover.component';

describe('CollectionsDiscoverComponent', () => {
  let component: CollectionsDiscoverComponent;
  let fixture: ComponentFixture<CollectionsDiscoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CollectionsDiscoverComponent,
        ...MockComponents(
          SearchInputComponent,
          CollectionsMainContentComponent,
          CollectionsSearchResultCardComponent,
          LoadingSpinnerComponent
        ),
        MockPipe(TranslatePipe),
      ],
      teardown: { destroyAfterEach: false },
      providers: [
        TranslateServiceMock,
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(DialogService),
        MockProvider(ToastService),
        { provide: SENTRY_TOKEN, useValue: { captureException: jest.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
            queryParams: of({}),
          },
        },
        provideStore([CollectionsState]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
