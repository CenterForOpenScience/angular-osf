import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserState } from '@core/store/user';
import { AdminTableComponent } from '@osf/features/admin-institutions/components';
import { InstitutionsAdminState } from '@osf/features/admin-institutions/store';
import { ToastService } from '@osf/shared/services';
import { LoadingSpinnerComponent, SelectComponent } from '@shared/components';
import { TranslateServiceMock } from '@shared/mocks';

import { InstitutionsUsersComponent } from './institutions-users.component';

describe('InstitutionsUsersComponent', () => {
  let component: InstitutionsUsersComponent;
  let fixture: ComponentFixture<InstitutionsUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InstitutionsUsersComponent,
        ...MockComponents(AdminTableComponent, SelectComponent, LoadingSpinnerComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [
        MockProvider(ActivatedRoute, { queryParams: of({}) }),
        MockProvider(Router),
        TranslateServiceMock,
        MockProvider(ToastService),
        provideStore([InstitutionsAdminState, UserState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
