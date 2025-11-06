import { MockComponents, MockPipes } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { InterpolatePipe } from '@osf/shared/pipes/interpolate.pipe';
import { ContributorsSelectors } from '@osf/shared/stores/contributors';
import { SubjectsSelectors } from '@osf/shared/stores/subjects';

import { PreprintDoiSectionComponent } from '../preprint-doi-section/preprint-doi-section.component';

import { PreprintTombstoneComponent } from './preprint-tombstone.component';

import { MOCK_CONTRIBUTOR } from '@testing/mocks/contributors.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintTombstoneComponent', () => {
  let component: PreprintTombstoneComponent;
  let fixture: ComponentFixture<PreprintTombstoneComponent>;

  const mockPreprint = PREPRINT_MOCK;
  const mockProvider = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockContributors = [MOCK_CONTRIBUTOR];
  const mockSubjects = SUBJECTS_MOCK;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PreprintTombstoneComponent,
        OSFTestingModule,
        ...MockComponents(
          PreprintDoiSectionComponent,
          TruncatedTextComponent,
          ContributorsListComponent,
          LicenseDisplayComponent
        ),
        MockPipes(InterpolatePipe),
      ],
      providers: [
        TranslationServiceMock,
        provideMockStore({
          signals: [
            {
              selector: PreprintSelectors.getPreprint,
              value: mockPreprint,
            },
            {
              selector: PreprintSelectors.isPreprintLoading,
              value: false,
            },
            {
              selector: ContributorsSelectors.getBibliographicContributors,
              value: mockContributors,
            },
            {
              selector: ContributorsSelectors.isBibliographicContributorsLoading,
              value: false,
            },
            {
              selector: ContributorsSelectors.hasMoreBibliographicContributors,
              value: false,
            },
            {
              selector: SubjectsSelectors.getSelectedSubjects,
              value: mockSubjects,
            },
            {
              selector: SubjectsSelectors.areSelectedSubjectsLoading,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintTombstoneComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('preprintProvider', mockProvider);
  });

  it('should compute license from preprint', () => {
    const license = component.license();
    expect(license).toBe(mockPreprint.embeddedLicense);
  });

  it('should return null license when no preprint', () => {
    jest.spyOn(component, 'preprint').mockReturnValue(null);
    const license = component.license();
    expect(license).toBeNull();
  });

  it('should compute license options record from preprint', () => {
    const licenseOptionsRecord = component.licenseOptionsRecord();
    expect(licenseOptionsRecord).toEqual(mockPreprint.licenseOptions);
  });

  it('should return empty object when no license options', () => {
    const preprintWithoutOptions = { ...mockPreprint, licenseOptions: null };
    jest.spyOn(component, 'preprint').mockReturnValue(preprintWithoutOptions);
    const licenseOptionsRecord = component.licenseOptionsRecord();
    expect(licenseOptionsRecord).toEqual({});
  });

  it('should handle preprint provider input', () => {
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
  });

  it('should emit preprintVersionSelected when version is selected', () => {
    const emitSpy = jest.spyOn(component.preprintVersionSelected, 'emit');
    component.preprintVersionSelected.emit('version-1');
    expect(emitSpy).toHaveBeenCalledWith('version-1');
  });
});
