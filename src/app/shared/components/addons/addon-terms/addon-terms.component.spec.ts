import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonCategory } from '@osf/shared/enums/addons-category.enum';
import { AddonModel } from '@shared/models/addons/addon.model';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { AddonTermsComponent } from './addon-terms.component';

describe('AddonTermsComponent', () => {
  let component: AddonTermsComponent;
  let fixture: ComponentFixture<AddonTermsComponent>;

  const createAddon = (overrides: Partial<AddonModel> = {}): AddonModel => ({
    id: 'addon-1',
    type: AddonCategory.EXTERNAL_STORAGE_SERVICES,
    displayName: 'Dropbox',
    externalServiceName: 'dropbox',
    providerName: 'Dropbox',
    supportedFeatures: [],
    ...overrides,
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AddonTermsComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(AddonTermsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty terms when addon is null', () => {
    fixture.componentRef.setInput('addon', null);
    fixture.detectChanges();

    expect(component.terms()).toEqual([]);
  });

  it('should mark redirect addons and return empty terms', () => {
    fixture.componentRef.setInput(
      'addon',
      createAddon({
        type: AddonCategory.EXTERNAL_REDIRECT_SERVICES,
      })
    );
    fixture.detectChanges();

    expect(component.isRedirectService()).toBe(true);
    expect(component.terms()).toEqual([]);
  });

  it('should build storage terms with provider replacement and warning for partial support', () => {
    fixture.componentRef.setInput(
      'addon',
      createAddon({
        supportedFeatures: ['ADD_UPDATE_FILES', 'DELETE_FILES_PARTIAL'],
      })
    );
    fixture.detectChanges();

    const terms = component.terms();
    const addUpdateTerm = terms.find((term) => term.function === 'Add / update files');
    const deleteTerm = terms.find((term) => term.function === 'Delete files');

    expect(addUpdateTerm).toEqual(
      expect.objectContaining({
        type: 'info',
      })
    );
    expect(addUpdateTerm?.status).toContain('Dropbox');
    expect(deleteTerm).toEqual(
      expect.objectContaining({
        type: 'warning',
      })
    );
  });

  it('should build citation terms using citation partial message when partial feature exists', () => {
    fixture.componentRef.setInput(
      'addon',
      createAddon({
        type: AddonCategory.EXTERNAL_CITATION_SERVICES,
        providerName: 'Mendeley',
        supportedFeatures: ['FORKING_PARTIAL'],
      })
    );
    fixture.detectChanges();

    const forkingTerm = component.terms().find((term) => term.function === 'Forking');

    expect(forkingTerm).toEqual(
      expect.objectContaining({
        type: 'warning',
      })
    );
    expect(forkingTerm?.status).toContain('Mendeley');
    expect(forkingTerm?.status).toContain('does not copy');
  });

  it('should build citation terms using citation false message when feature is missing', () => {
    fixture.componentRef.setInput(
      'addon',
      createAddon({
        type: AddonCategory.EXTERNAL_CITATION_SERVICES,
        providerName: 'Zotero',
        supportedFeatures: [],
      })
    );
    fixture.detectChanges();

    const registeringTerm = component.terms().find((term) => term.function === 'Registering');

    expect(registeringTerm).toEqual(
      expect.objectContaining({
        type: 'danger',
      })
    );
    expect(registeringTerm?.status).toBe('Zotero content will not be registered.');
  });
});
