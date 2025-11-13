import { provideStore } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminTableComponent } from '@osf/features/admin-institutions/components';
import { InstitutionsAdminState } from '@osf/features/admin-institutions/store';
import { InstitutionsSearchState } from '@osf/shared/stores/institutions-search';

import { FiltersSectionComponent } from '../../components/filters-section/filters-section.component';

import { InstitutionsRegistrationsComponent } from './institutions-registrations.component';

describe.skip('InstitutionsRegistrationsComponent', () => {
  let component: InstitutionsRegistrationsComponent;
  let fixture: ComponentFixture<InstitutionsRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionsRegistrationsComponent, ...MockComponents(AdminTableComponent, FiltersSectionComponent)],
      providers: [
        MockProvider(ActivatedRoute, { queryParams: of({}) }),
        MockProvider(Router),
        provideStore([InstitutionsAdminState, InstitutionsSearchState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
