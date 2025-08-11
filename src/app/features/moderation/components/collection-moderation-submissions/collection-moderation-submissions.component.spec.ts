import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { CollectionSubmissionsListComponent } from '@osf/features/moderation/components';
import { CollectionsModerationState } from '@osf/features/moderation/store/collections-moderation';
import { CustomPaginatorComponent, IconComponent, LoadingSpinnerComponent, SelectComponent } from '@shared/components';
import { CollectionsState } from '@shared/stores';

import { CollectionModerationSubmissionsComponent } from './collection-moderation-submissions.component';

describe('CollectionModerationSubmissionsComponent', () => {
  let component: CollectionModerationSubmissionsComponent;
  let fixture: ComponentFixture<CollectionModerationSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CollectionModerationSubmissionsComponent,
        ...MockComponents(
          SelectComponent,
          CollectionSubmissionsListComponent,
          IconComponent,
          CustomPaginatorComponent,
          LoadingSpinnerComponent
        ),
        MockPipe(TranslatePipe),
      ],
      providers: [
        provideStore([CollectionsState, CollectionsModerationState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => '1' },
              queryParams: {},
            },
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionModerationSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
