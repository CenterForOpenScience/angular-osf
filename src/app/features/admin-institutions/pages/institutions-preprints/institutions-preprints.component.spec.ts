import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProviders } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminTableComponent } from '@osf/features/admin-institutions/components';
import { InstitutionsAdminState } from '@osf/features/admin-institutions/store';
import { LoadingSpinnerComponent } from '@shared/components';

import { InstitutionsPreprintsComponent } from './institutions-preprints.component';

describe.skip('InstitutionsPreprintsComponent', () => {
  let component: InstitutionsPreprintsComponent;
  let fixture: ComponentFixture<InstitutionsPreprintsComponent>;

  const mockRoute = {
    parent: { snapshot: { params: { 'institution-id': '42' } } },
    snapshot: { queryParams: {} },
    queryParams: of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InstitutionsPreprintsComponent,
        ...MockComponents(AdminTableComponent, LoadingSpinnerComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [
        MockProviders(Router),
        { provide: ActivatedRoute, useValue: mockRoute },
        provideStore([InstitutionsAdminState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsPreprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
