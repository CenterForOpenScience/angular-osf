import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { UserState } from '@core/store/user';
import { ModeratorsTableComponent } from '@osf/features/moderation/components';
import { ModeratorsState } from '@osf/features/moderation/store/moderators';
import { SearchInputComponent } from '@shared/components';
import { MockCustomConfirmationServiceProvider, TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';

import { ModeratorsListComponent } from './moderators-list.component';

describe('ModeratorsListComponent', () => {
  let component: ModeratorsListComponent;
  let fixture: ComponentFixture<ModeratorsListComponent>;

  const mockRoute = {
    data: of({ resourceType: undefined }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModeratorsListComponent,
        ...MockComponents(ModeratorsTableComponent, SearchInputComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [
        TranslateServiceMock,
        MockCustomConfirmationServiceProvider,
        MockProvider(ToastService),
        {
          provide: ActivatedRoute,
          useValue: mockRoute,
        },
        provideStore([ModeratorsState, UserState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModeratorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
