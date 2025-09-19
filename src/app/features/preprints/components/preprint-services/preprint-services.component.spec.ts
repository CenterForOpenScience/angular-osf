import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintProviderShortInfo } from '@osf/features/preprints/models';

import { PreprintServicesComponent } from './preprint-services.component';

import { PREPRINT_PROVIDER_SHORT_INFO_MOCK } from '@testing/mocks/preprint-provider-short-info.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('PreprintServicesComponent', () => {
  let component: PreprintServicesComponent;
  let fixture: ComponentFixture<PreprintServicesComponent>;

  const mockProviders: PreprintProviderShortInfo[] = [PREPRINT_PROVIDER_SHORT_INFO_MOCK];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintServicesComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintServicesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('preprintProvidersToAdvertise', []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept preprint providers input', () => {
    fixture.componentRef.setInput('preprintProvidersToAdvertise', mockProviders);
    fixture.detectChanges();

    expect(component.preprintProvidersToAdvertise()).toEqual(mockProviders);
  });

  it('should handle empty providers array', () => {
    fixture.componentRef.setInput('preprintProvidersToAdvertise', []);
    fixture.detectChanges();

    expect(component.preprintProvidersToAdvertise()).toEqual([]);
  });
});
