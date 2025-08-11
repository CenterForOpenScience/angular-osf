import { provideStore } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { PreprintSubmissionItemComponent } from '@osf/features/moderation/components';
import { PreprintModerationState } from '@osf/features/moderation/store/preprint-moderation';
import { CustomPaginatorComponent, IconComponent, LoadingSpinnerComponent, SelectComponent } from '@shared/components';

import { PreprintWithdrawalSubmissionsComponent } from './preprint-withdrawal-submissions.component';

describe('PreprintWithdrawalSubmissionsComponent', () => {
  let component: PreprintWithdrawalSubmissionsComponent;
  let fixture: ComponentFixture<PreprintWithdrawalSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PreprintWithdrawalSubmissionsComponent,
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
            parent: {
              params: of({ id: '1' }),
            },
            snapshot: {
              queryParams: { wiki: 'test' },
            },
            queryParams: of({ wiki: 'test' }),
          },
        },
        provideStore([PreprintModerationState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintWithdrawalSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
