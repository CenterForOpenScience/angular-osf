import { provideStore } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { AdminTableComponent } from '@osf/features/admin-institutions/components';
import { InstitutionsAdminState } from '@osf/features/admin-institutions/store';
import { ToastService } from '@osf/shared/services';
import { InstitutionsSearchState } from '@osf/shared/stores/institutions-search';
import { LoadingSpinnerComponent } from '@shared/components';

import { InstitutionsProjectsComponent } from './institutions-projects.component';

describe('InstitutionsProjectsComponent', () => {
  let component: InstitutionsProjectsComponent;
  let fixture: ComponentFixture<InstitutionsProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InstitutionsProjectsComponent,
        ...MockComponents(AdminTableComponent, LoadingSpinnerComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [
        MockProvider(ActivatedRoute, { queryParams: of({}) }),
        MockProvider(ToastService),
        MockProvider(TranslateService),
        provideStore([InstitutionsAdminState, InstitutionsSearchState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
