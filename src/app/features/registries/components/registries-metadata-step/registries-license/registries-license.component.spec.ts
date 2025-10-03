import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { RegistriesSelectors } from '@osf/features/registries/store';
import { LicenseComponent } from '@shared/components';

import { RegistriesLicenseComponent } from './registries-license.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('LicenseComponent', () => {
  let component: RegistriesLicenseComponent;
  let fixture: ComponentFixture<RegistriesLicenseComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build();

    await TestBed.configureTestingModule({
      imports: [RegistriesLicenseComponent, OSFTestingModule, MockComponent(LicenseComponent)],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(ENVIRONMENT, { defaultProvider: 'prov-default' }),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getLicenses, value: [] },
            { selector: RegistriesSelectors.getSelectedLicense, value: null },
            { selector: RegistriesSelectors.getDraftRegistration, value: { id: 'draft-1', providerId: 'prov-1' } },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesLicenseComponent);
    component = fixture.componentInstance;

    const fb = TestBed.inject(FormBuilder);
    fixture.componentRef.setInput('control', fb.group({ id: [''] }) as FormGroup);
    const mockActions = {
      fetchLicenses: jest.fn().mockReturnValue(of({})),
      saveLicense: jest.fn().mockReturnValue(of({})),
    } as any;
    Object.defineProperty(component, 'actions', { value: mockActions });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch licenses when draftRegistration exists', () => {
    const actions = (component as any).actions;
    expect(actions.fetchLicenses).toHaveBeenCalledWith('prov-1');
  });

  it('should create license', () => {
    const actions = (component as any).actions;
    component.createLicense({ id: 'lic-2', licenseOptions: {} as any });
    expect(actions.saveLicense).toHaveBeenCalledWith('draft-1', 'lic-2', {});
  });

  it('should select license without required fields and save', () => {
    const actions = (component as any).actions;
    component.selectLicense({ id: 'lic-3', requiredFields: [] } as any);
    expect(component.control().value).toMatchObject({ id: 'lic-3' });
    expect(actions.saveLicense).toHaveBeenCalledWith('draft-1', 'lic-3');
  });
});
