import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PreprintProviderShortInfo } from '@osf/features/preprints/models';

import { PREPRINT_PROVIDER_SHORT_INFO_MOCK } from '@testing/mocks/preprint-provider-short-info.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { PreprintServicesComponent } from './preprint-services.component';

describe('PreprintServicesComponent', () => {
  let component: PreprintServicesComponent;
  let fixture: ComponentFixture<PreprintServicesComponent>;

  const mockProviders: PreprintProviderShortInfo[] = [PREPRINT_PROVIDER_SHORT_INFO_MOCK];

  function setup(providers: PreprintProviderShortInfo[]) {
    TestBed.configureTestingModule({
      imports: [PreprintServicesComponent],
      providers: [provideOSFCore(), provideRouter([])],
    });

    fixture = TestBed.createComponent(PreprintServicesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('preprintProvidersToAdvertise', providers);
  }

  it('should create', () => {
    setup(mockProviders);
    expect(component).toBeTruthy();
  });

  it('should keep provided providers input', () => {
    setup(mockProviders);

    expect(component.preprintProvidersToAdvertise()).toEqual(mockProviders);
  });

  it('should keep empty providers input', () => {
    setup([]);

    expect(component.preprintProvidersToAdvertise()).toEqual([]);
  });
});
