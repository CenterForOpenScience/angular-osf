import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { AdminTableComponent } from '@osf/features/admin-institutions/components';
import { InstitutionsAdminState } from '@osf/features/admin-institutions/store';
import { LoadingSpinnerComponent } from '@shared/components';
import { InstitutionsSearchState } from '@shared/stores';

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
