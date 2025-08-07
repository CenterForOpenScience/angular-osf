import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipes, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistryPendingSubmissionsComponent } from '@osf/features/moderation/components';
import { RegistryModerationState } from '@osf/features/moderation/store/registry-moderation';
import { TranslateServiceMock } from '@shared/mocks';

describe.skip('RegistryPendingSubmissionsComponent', () => {
  let component: RegistryPendingSubmissionsComponent;
  let fixture: ComponentFixture<RegistryPendingSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryPendingSubmissionsComponent, ...MockPipes(TranslatePipe)],
      providers: [
        provideStore([RegistryModerationState]),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of({ providerId: 'id1' }),
            },
            snapshot: {
              queryParams: {},
            },
          },
        },
        MockProvider(Router),
        TranslateServiceMock,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryPendingSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
