import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { isCitationAddon } from '@osf/shared/helpers';
import { AddonTermsComponent } from '@shared/components/addons';
import { ADDON_TERMS } from '@shared/constants';
import { MOCK_ADDON } from '@shared/mocks';
import { AddonModel, AddonTerm } from '@shared/models';

jest.mock('@shared/helpers', () => ({
  isCitationAddon: jest.fn(),
}));

describe('AddonTermsComponent', () => {
  let component: AddonTermsComponent;
  let fixture: ComponentFixture<AddonTermsComponent>;
  const mockIsCitationAddon = isCitationAddon as jest.MockedFunction<typeof isCitationAddon>;
  const mockAddon: AddonModel = MOCK_ADDON;

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
    const addonWithoutFeatures: AddonModel = {
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
    const addonWithPartialFeatures: AddonModel = {
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
    const customProviderAddon: AddonModel = {
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

  it('should show all terms when isCitationService is false', () => {
    const regularAddon: AddonModel = {
      ...mockAddon,
      supportedFeatures: ['STORAGE', 'FORKING'],
    };

    mockIsCitationAddon.mockReturnValue(false);
    fixture.componentRef.setInput('addon', regularAddon);

    const terms = (component as any).terms();

    expect(terms.length).toBeGreaterThan(0);

    const allTerms = (component as any).getAddonTerms(regularAddon);
    expect(terms.length).toBe(allTerms.length);
  });

  it('should handle citation service without required features', () => {
    const citationAddonWithoutFeatures: AddonModel = {
      ...mockAddon,
      supportedFeatures: [],
    };

    mockIsCitationAddon.mockReturnValue(true);
    fixture.componentRef.setInput('addon', citationAddonWithoutFeatures);

    const terms = (component as any).terms();

    expect(terms.length).toBeGreaterThan(0);

    const hasDangerTerm = terms.some((term: AddonTerm) => term.type === 'danger');
    expect(hasDangerTerm).toBe(true);
  });

  it('should handle citation service with full features', () => {
    const citationAddonWithFullFeatures: AddonModel = {
      ...mockAddon,
      supportedFeatures: ['STORAGE', 'FORKING'],
    };

    mockIsCitationAddon.mockReturnValue(true);
    fixture.componentRef.setInput('addon', citationAddonWithFullFeatures);

    const terms = (component as any).terms();

    expect(terms.length).toBeGreaterThan(0);

    const hasInfoTerm = terms.some((term: AddonTerm) => term.type === 'info');
    expect(hasInfoTerm).toBe(true);
  });

  it('should handle null addon input', () => {
    fixture.componentRef.setInput('addon', null);

    const terms = (component as any).terms();

    expect(terms).toEqual([]);
  });

  it('should handle undefined addon input', () => {
    fixture.componentRef.setInput('addon', undefined);

    const terms = (component as any).terms();

    expect(terms).toEqual([]);
  });

  it('should handle addon with empty supportedFeatures', () => {
    const addonWithEmptyFeatures: AddonModel = {
      ...mockAddon,
      supportedFeatures: [],
    };

    mockIsCitationAddon.mockReturnValue(false);
    fixture.componentRef.setInput('addon', addonWithEmptyFeatures);

    const terms = (component as any).terms();

    expect(terms.length).toBeGreaterThan(0);

    terms.forEach((term: AddonTerm) => {
      expect(term.type).toBe('danger');
    });
  });

  it('should handle addon with partial features only', () => {
    const addonWithPartialOnly: AddonModel = {
      ...mockAddon,
      supportedFeatures: ['STORAGE_PARTIAL', 'FORKING_PARTIAL'],
    };

    mockIsCitationAddon.mockReturnValue(false);
    fixture.componentRef.setInput('addon', addonWithPartialOnly);

    const terms = (component as any).terms();

    expect(terms.length).toBeGreaterThan(0);

    const hasWarningTerm = terms.some((term: AddonTerm) => term.type === 'warning');
    expect(hasWarningTerm).toBe(true);
  });

  it('should handle addon with mixed features (full, partial, none)', () => {
    const addonWithMixedFeatures: AddonModel = {
      ...mockAddon,
      supportedFeatures: ['STORAGE', 'FORKING_PARTIAL'],
    };
    mockIsCitationAddon.mockReturnValue(false);
    fixture.componentRef.setInput('addon', addonWithMixedFeatures);

    const terms = (component as any).terms();

    expect(terms.length).toBeGreaterThan(0);

    const hasInfoTerm = terms.some((term: AddonTerm) => term.type === 'info');
    const hasWarningTerm = terms.some((term: AddonTerm) => term.type === 'warning');
    const hasDangerTerm = terms.some((term: AddonTerm) => term.type === 'danger');

    expect(hasInfoTerm || hasWarningTerm || hasDangerTerm).toBe(true);
  });
});
