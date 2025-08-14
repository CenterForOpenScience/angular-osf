import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { isCitationAddon } from '@osf/shared/helpers';
import { AddonTermsComponent } from '@shared/components/addons';
import { ADDON_TERMS } from '@shared/constants';
import { MOCK_ADDON } from '@shared/mocks';
import { Addon, AddonTerm } from '@shared/models';

jest.mock('@shared/helpers', () => ({
  isCitationAddon: jest.fn(),
}));

describe('AddonTermsComponent', () => {
  let component: AddonTermsComponent;
  let fixture: ComponentFixture<AddonTermsComponent>;
  const mockIsCitationAddon = isCitationAddon as jest.MockedFunction<typeof isCitationAddon>;
  const mockAddon: Addon = MOCK_ADDON;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonTermsComponent],
      providers: [MockProvider(TranslateService)],
    }).compileComponents();

    fixture = TestBed.createComponent(AddonTermsComponent);
    component = fixture.componentInstance;

    mockIsCitationAddon.mockReturnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty array when addon is null', () => {
    fixture.componentRef.setInput('addon', null);

    expect((component as any).terms()).toEqual([]);
  });

  it('should return terms for regular addon with unsupported features', () => {
    const addonWithoutFeatures: Addon = {
      ...mockAddon,
      supportedFeatures: [],
    };

    mockIsCitationAddon.mockReturnValue(false);
    fixture.componentRef.setInput('addon', addonWithoutFeatures);

    const terms = (component as any).terms();

    expect(terms).toHaveLength(ADDON_TERMS.length);

    const addUpdateTerm = terms.find((term: AddonTerm) => term.function === 'Add / update files');
    expect(addUpdateTerm.type).toBe('danger');
    expect(addUpdateTerm.status).toContain('cannot add or update');
  });

  it('should return terms for regular addon with partial features', () => {
    const addonWithPartialFeatures: Addon = {
      ...mockAddon,
      supportedFeatures: ['FORKING_PARTIAL'],
    };

    mockIsCitationAddon.mockReturnValue(false);
    fixture.componentRef.setInput('addon', addonWithPartialFeatures);

    const terms = (component as any).terms();

    const forkingTerm = terms.find((term: AddonTerm) => term.function === 'Forking');
    expect(forkingTerm.type).toBe('warning');
    expect(forkingTerm.status).toContain(MOCK_ADDON.providerName);
  });

  it('should replace {provider} placeholder with actual provider name', () => {
    const customProviderAddon: Addon = {
      ...mockAddon,
      providerName: 'CustomProvider',
    };

    mockIsCitationAddon.mockReturnValue(false);
    fixture.componentRef.setInput('addon', customProviderAddon);

    const terms = (component as any).terms();

    terms.forEach((term: AddonTerm) => {
      expect(term.status).toContain('CustomProvider');
      expect(term.status).not.toContain('{provider}');
    });
  });
});
