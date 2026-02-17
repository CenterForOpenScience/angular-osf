import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { BrandService } from '@osf/shared/services/brand.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { HeaderStyleService } from '@osf/shared/services/header-style.service';
import { RegistryProviderDetails } from '@shared/models/provider/registry-provider.model';

import { RegistryProviderHeroComponent } from './registry-provider-hero.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomDialogServiceMockBuilder,
  CustomDialogServiceMockType,
} from '@testing/providers/custom-dialog-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';

describe('RegistryProviderHeroComponent', () => {
  let component: RegistryProviderHeroComponent;
  let fixture: ComponentFixture<RegistryProviderHeroComponent>;
  let mockRouter: RouterMockType;
  let mockDialog: CustomDialogServiceMockType;
  let mockBrandService: { applyBranding: jest.Mock; resetBranding: jest.Mock };
  let mockHeaderStyleService: { applyHeaderStyles: jest.Mock; resetToDefaults: jest.Mock };

  const mockProvider: RegistryProviderDetails = {
    id: 'prov-1',
    name: 'Provider',
    descriptionHtml: '',
    permissions: [],
    brand: null,
    iri: '',
    reviewsWorkflow: '',
  };

  beforeEach(() => {
    mockRouter = RouterMockBuilder.create().withUrl('/x').build();
    mockDialog = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    mockBrandService = { applyBranding: jest.fn(), resetBranding: jest.fn() };
    mockHeaderStyleService = { applyHeaderStyles: jest.fn(), resetToDefaults: jest.fn() };

    TestBed.configureTestingModule({
      imports: [RegistryProviderHeroComponent, MockComponent(SearchInputComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(Router, mockRouter),
        MockProvider(CustomDialogService, mockDialog),
        MockProvider(BrandService, mockBrandService),
        MockProvider(HeaderStyleService, mockHeaderStyleService),
      ],
    });

    fixture = TestBed.createComponent(RegistryProviderHeroComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', mockProvider);
    fixture.componentRef.setInput('isProviderLoading', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit triggerSearch on onTriggerSearch', () => {
    jest.spyOn(component.triggerSearch, 'emit');
    component.onTriggerSearch('abc');
    expect(component.triggerSearch.emit).toHaveBeenCalledWith('abc');
  });

  it('should open help dialog', () => {
    component.openHelpDialog();
    expect(mockDialog.open).toHaveBeenCalledWith(expect.any(Function), {
      header: 'preprints.helpDialog.header',
    });
  });

  it('should navigate to create page when provider id present', () => {
    component.navigateToCreatePage();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries/prov-1/new']);
  });

  it('should not navigate when provider id missing', () => {
    fixture.componentRef.setInput('provider', { ...mockProvider, id: undefined });
    component.navigateToCreatePage();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should apply branding and header styles when provider has brand', () => {
    const brand = {
      primaryColor: '#111',
      secondaryColor: '#222',
      backgroundColor: '#333',
      topNavLogoImageUrl: 'logo.png',
      heroBackgroundImageUrl: 'hero.png',
    };

    fixture.componentRef.setInput('provider', { ...mockProvider, brand });
    fixture.detectChanges();

    expect(mockBrandService.applyBranding).toHaveBeenCalledWith(brand);
    expect(mockHeaderStyleService.applyHeaderStyles).toHaveBeenCalledWith('#ffffff', '#111', 'hero.png');
  });

  it('should not apply branding when provider has no brand', () => {
    expect(mockBrandService.applyBranding).not.toHaveBeenCalled();
    expect(mockHeaderStyleService.applyHeaderStyles).not.toHaveBeenCalled();
  });

  it('should reset branding and header styles on destroy', () => {
    component.ngOnDestroy();

    expect(mockHeaderStyleService.resetToDefaults).toHaveBeenCalled();
    expect(mockBrandService.resetBranding).toHaveBeenCalled();
  });
});
