import { provideStore } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { PreprintSubmissionItemComponent } from '@osf/features/moderation/components';
import { PreprintModerationState } from '@osf/features/moderation/store/preprint-moderation';
import { CustomPaginatorComponent, IconComponent, LoadingSpinnerComponent, SelectComponent } from '@shared/components';

import { PreprintSubmissionsComponent } from './preprint-submissions.component';

describe('PreprintSubmissionsComponent', () => {
  let component: PreprintSubmissionsComponent;
  let fixture: ComponentFixture<PreprintSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PreprintSubmissionsComponent,
        ...MockComponents(
          SelectComponent,
          IconComponent,
          LoadingSpinnerComponent,
          PreprintSubmissionItemComponent,
          CustomPaginatorComponent
        ),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              queryParams: {},
            },
          },
        },
        provideStore([PreprintModerationState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
