import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintModel } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { PreprintDoiSectionComponent } from './preprint-doi-section.component';

describe('PreprintDoiSectionComponent', () => {
  let component: PreprintDoiSectionComponent;
  let fixture: ComponentFixture<PreprintDoiSectionComponent>;

  const mockPreprint = PREPRINT_MOCK;

  const mockProvider = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockVersionIds = ['version-1', 'version-2', 'version-3'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreprintDoiSectionComponent],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [
            { selector: PreprintSelectors.getPreprint, value: mockPreprint },
            { selector: PreprintSelectors.getPreprintVersionIds, value: mockVersionIds },
            { selector: PreprintSelectors.arePreprintVersionIdsLoading, value: false },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(PreprintDoiSectionComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('preprintProvider', mockProvider);
  });

  it('should compute versions dropdown options from version IDs', () => {
    const options = component.versionsDropdownOptions();
    expect(options).toHaveLength(3);
    expect(options.map((option) => option.value)).toEqual(['version-1', 'version-2', 'version-3']);
    expect(options.every((option) => typeof option.label === 'string' && option.label.length > 0)).toBe(true);
  });

  it('should return empty array when no version IDs', () => {
    vi.spyOn(component, 'preprintVersionIds').mockReturnValue([]);
    const options = component.versionsDropdownOptions();
    expect(options).toEqual([]);
  });

  it('should return empty array when version IDs are undefined', () => {
    vi.spyOn(component, 'preprintVersionIds').mockReturnValue(undefined as unknown as string[]);
    const options = component.versionsDropdownOptions();
    expect(options).toEqual([]);
  });

  it('should emit preprintVersionSelected when selecting different version', () => {
    const emitSpy = vi.spyOn(component.preprintVersionSelected, 'emit');
    component.selectPreprintVersion('version-2');
    expect(emitSpy).toHaveBeenCalledWith('version-2');
  });

  it('should not emit when selecting current preprint version', () => {
    const emitSpy = vi.spyOn(component.preprintVersionSelected, 'emit');
    component.selectPreprintVersion('preprint-1');
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit when current preprint is unavailable', () => {
    vi.spyOn(component, 'preprint').mockReturnValue(undefined as unknown as PreprintModel);
    const emitSpy = vi.spyOn(component.preprintVersionSelected, 'emit');
    component.selectPreprintVersion('version-2');
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should handle preprint provider input', () => {
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
  });
});
