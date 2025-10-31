import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintModel, PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';

import { PreprintDoiSectionComponent } from './preprint-doi-section.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintDoiSectionComponent', () => {
  let component: PreprintDoiSectionComponent;
  let fixture: ComponentFixture<PreprintDoiSectionComponent>;

  const mockPreprint: PreprintModel = PREPRINT_MOCK;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockVersionIds = ['version-1', 'version-2', 'version-3'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintDoiSectionComponent, OSFTestingModule],
      providers: [
        TranslationServiceMock,
        provideMockStore({
          signals: [
            {
              selector: PreprintSelectors.getPreprint,
              value: mockPreprint,
            },
            {
              selector: PreprintSelectors.getPreprintVersionIds,
              value: mockVersionIds,
            },
            {
              selector: PreprintSelectors.arePreprintVersionIdsLoading,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintDoiSectionComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('preprintProvider', mockProvider);
  });

  it('should compute versions dropdown options from version IDs', () => {
    const options = component.versionsDropdownOptions();
    expect(options).toEqual([
      { label: 'Version 3', value: 'version-1' },
      { label: 'Version 2', value: 'version-2' },
      { label: 'Version 1', value: 'version-3' },
    ]);
  });

  it('should return empty array when no version IDs', () => {
    jest.spyOn(component, 'preprintVersionIds').mockReturnValue([]);
    const options = component.versionsDropdownOptions();
    expect(options).toEqual([]);
  });

  it('should emit preprintVersionSelected when selecting different version', () => {
    const emitSpy = jest.spyOn(component.preprintVersionSelected, 'emit');
    component.selectPreprintVersion('version-2');
    expect(emitSpy).toHaveBeenCalledWith('version-2');
  });

  it('should not emit when selecting current preprint version', () => {
    const emitSpy = jest.spyOn(component.preprintVersionSelected, 'emit');
    component.selectPreprintVersion('preprint-1');
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should handle preprint provider input', () => {
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
  });
});
