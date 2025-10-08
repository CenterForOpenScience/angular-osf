import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RegistryProviderHeroComponent } from '@osf/features/registries/components/registry-provider-hero/registry-provider-hero.component';
import { CustomDialogService } from '@osf/shared/services';
import { RegistrationProviderSelectors } from '@osf/shared/stores/registration-provider';
import { GlobalSearchComponent } from '@shared/components';

import { RegistriesProviderSearchComponent } from './registries-provider-search.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesProviderSearchComponent', () => {
  let component: RegistriesProviderSearchComponent;
  let fixture: ComponentFixture<RegistriesProviderSearchComponent>;

  beforeEach(async () => {
    const routeMock = ActivatedRouteMockBuilder.create().withParams({ name: 'osf' }).build();

    await TestBed.configureTestingModule({
      imports: [
        RegistriesProviderSearchComponent,
        OSFTestingModule,
        ...MockComponents(GlobalSearchComponent, RegistryProviderHeroComponent),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
        MockProvider(CustomDialogService, { open: jest.fn() }),
        provideMockStore({
          signals: [
            { selector: RegistrationProviderSelectors.getBrandedProvider, value: { iri: 'http://iri/provider' } },
            { selector: RegistrationProviderSelectors.isBrandedProviderLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesProviderSearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should clear providers on destroy', () => {
    fixture.detectChanges();

    const actionsMock = {
      getProvider: jest.fn(),
      setDefaultFilterValue: jest.fn(),
      setResourceType: jest.fn(),
      clearCurrentProvider: jest.fn(),
      clearRegistryProvider: jest.fn(),
    } as any;
    Object.defineProperty(component as any, 'actions', { value: actionsMock });

    fixture.destroy();
    expect(actionsMock.clearCurrentProvider).toHaveBeenCalled();
    expect(actionsMock.clearRegistryProvider).toHaveBeenCalled();
  });
});
