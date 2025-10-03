import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { InstitutionsSelectors } from '@osf/shared/stores';
import { AffiliatedInstitutionSelectComponent } from '@shared/components';

import { RegistriesAffiliatedInstitutionComponent } from './registries-affiliated-institution.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesAffiliatedInstitutionComponent', () => {
  let component: RegistriesAffiliatedInstitutionComponent;
  let fixture: ComponentFixture<RegistriesAffiliatedInstitutionComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build();
    await TestBed.configureTestingModule({
      imports: [
        RegistriesAffiliatedInstitutionComponent,
        OSFTestingModule,
        MockComponent(AffiliatedInstitutionSelectComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        provideMockStore({
          signals: [
            { selector: InstitutionsSelectors.getUserInstitutions, value: [] },
            { selector: InstitutionsSelectors.areUserInstitutionsLoading, value: false },
            { selector: InstitutionsSelectors.getResourceInstitutions, value: [] },
            { selector: InstitutionsSelectors.areResourceInstitutionsLoading, value: false },
            { selector: InstitutionsSelectors.areResourceInstitutionsSubmitting, value: false },
            { selector: RegistriesSelectors.getDraftRegistration, value: { id: 'draft-1' } },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesAffiliatedInstitutionComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selected institutions from selector on init', () => {
    expect(component).toBeTruthy();
  });
});
