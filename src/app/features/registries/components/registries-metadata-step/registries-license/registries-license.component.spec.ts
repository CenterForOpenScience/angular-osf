import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { LicenseComponent } from '@osf/shared/components/license/license.component';

import { RegistriesLicenseComponent } from './registries-license.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesLicenseComponent', () => {
  let component: RegistriesLicenseComponent;
  let fixture: ComponentFixture<RegistriesLicenseComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build();

    await TestBed.configureTestingModule({
      imports: [RegistriesLicenseComponent, OSFTestingModule, MockComponent(LicenseComponent)],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getLicenses, value: [] },
            { selector: RegistriesSelectors.getSelectedLicense, value: null },
            { selector: RegistriesSelectors.getDraftRegistration, value: { providerId: 'osf' } },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesLicenseComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', new FormGroup({ id: new FormControl('') }));
    const mockActions = {
      fetchLicenses: jest.fn().mockReturnValue({}),
      saveLicense: jest.fn().mockReturnValue({}),
    } as any;
    Object.defineProperty(component, 'actions', { value: mockActions });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch licenses on init when draft present', () => {
    expect((component as any).actions.fetchLicenses).toHaveBeenCalledWith('osf');
  });

  it('should set control id and save license when selecting simple license', () => {
    const saveSpy = jest.spyOn((component as any).actions, 'saveLicense');
    component.selectLicense({ id: 'lic-1', requiredFields: [] } as any);
    expect((component.control() as FormGroup).get('id')?.value).toBe('lic-1');
    expect(saveSpy).toHaveBeenCalledWith('draft-1', 'lic-1');
  });

  it('should not save when license has required fields', () => {
    const saveSpy = jest.spyOn((component as any).actions, 'saveLicense');
    component.selectLicense({ id: 'lic-2', requiredFields: ['year'] } as any);
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should create license with options', () => {
    const saveSpy = jest.spyOn((component as any).actions, 'saveLicense');
    component.createLicense({ id: 'lic-3', licenseOptions: { year: '2024', copyrightHolders: 'Me' } as any });
    expect(saveSpy).toHaveBeenCalledWith('draft-1', 'lic-3', { year: '2024', copyrightHolders: 'Me' });
  });

  it('should mark control on focus out', () => {
    const control = new FormGroup({ id: new FormControl('') });
    fixture.componentRef.setInput('control', control);
    const spy = jest.spyOn(control, 'updateValueAndValidity');
    component.onFocusOut();
    expect(control.touched).toBe(true);
    expect(control.dirty).toBe(true);
    expect(spy).toHaveBeenCalled();
  });
});
