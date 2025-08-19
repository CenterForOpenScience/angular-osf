import { provideStore } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RegistrySubmissionItemComponent } from '@osf/features/moderation/components';
import { RegistryModerationState } from '@osf/features/moderation/store/registry-moderation';
import { CustomPaginatorComponent, IconComponent, LoadingSpinnerComponent, SelectComponent } from '@shared/components';

import { RegistrySubmissionsComponent } from './registry-submissions.component';

describe('RegistrySubmissionsComponent', () => {
  let component: RegistrySubmissionsComponent;
  let fixture: ComponentFixture<RegistrySubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegistrySubmissionsComponent,
        ...MockComponents(
          SelectComponent,
          IconComponent,
          LoadingSpinnerComponent,
          RegistrySubmissionItemComponent,
          CustomPaginatorComponent
        ),
      ],
      providers: [
        provideStore([RegistryModerationState]),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of({ providerId: '1' }),
            },
            snapshot: {
              queryParams: {},
            },
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrySubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
