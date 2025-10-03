import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { InstitutionsSelectors } from '@osf/shared/stores';

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
      imports: [RegistriesAffiliatedInstitutionComponent, OSFTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideMockStore({
          signals: [
            { selector: InstitutionsSelectors.getUserInstitutions, value: [] },
            { selector: InstitutionsSelectors.areUserInstitutionsLoading, value: false },
            { selector: InstitutionsSelectors.getResourceInstitutions, value: [] },
            { selector: InstitutionsSelectors.areResourceInstitutionsLoading, value: false },
            { selector: InstitutionsSelectors.areResourceInstitutionsSubmitting, value: false },
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

  it('should dispatch updateResourceInstitutions on selection', () => {
    const actionsMock = {
      updateResourceInstitutions: jest.fn(),
      fetchUserInstitutions: jest.fn(),
      fetchResourceInstitutions: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    const selected = [{ id: 'i2' }] as any;
    component.institutionsSelected(selected);
    expect(actionsMock.updateResourceInstitutions).toHaveBeenCalledWith('draft-1', 8, selected);
  });

  it('should fetch user and resource institutions on init', () => {
    const actionsMock = {
      updateResourceInstitutions: jest.fn(),
      fetchUserInstitutions: jest.fn(),
      fetchResourceInstitutions: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    component.ngOnInit();
    expect(actionsMock.fetchUserInstitutions).toHaveBeenCalled();
    expect(actionsMock.fetchResourceInstitutions).toHaveBeenCalledWith('draft-1', 8);
  });
});
