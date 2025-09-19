import { MockComponent, MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationSectionComponent } from '@osf/features/preprints/components/preprint-details/citation-section/citation-section.component';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { InterpolatePipe } from '@shared/pipes';
import { SubjectsSelectors } from '@shared/stores';

import { AdditionalInfoComponent } from './additional-info.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AdditionalInfoComponent', () => {
  let component: AdditionalInfoComponent;
  let fixture: ComponentFixture<AdditionalInfoComponent>;

  const mockPreprint = PREPRINT_MOCK;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdditionalInfoComponent,
        OSFTestingModule,
        MockComponent(CitationSectionComponent),
        MockPipe(InterpolatePipe),
      ],
      providers: [
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
              selector: SubjectsSelectors.getSelectedSubjects,
              value: [],
            },
            {
              selector: SubjectsSelectors.areSelectedSubjectsLoading,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return license from preprint when available', () => {
    const license = component.license();
    expect(license).toBe(mockPreprint.embeddedLicense);
  });

  it('should return license options record from preprint when available', () => {
    const licenseOptionsRecord = component.licenseOptionsRecord();
    expect(licenseOptionsRecord).toEqual(mockPreprint.licenseOptions);
  });

  it('should have skeleton data array with 5 null elements', () => {
    expect(component.skeletonData).toHaveLength(5);
    expect(component.skeletonData.every((item) => item === null)).toBe(true);
  });

  it('should return license from preprint when available', () => {
    const license = component.license();
    expect(license).toBe(mockPreprint.embeddedLicense);
  });

  it('should return license options record from preprint when available', () => {
    const licenseOptionsRecord = component.licenseOptionsRecord();
    expect(licenseOptionsRecord).toEqual(mockPreprint.licenseOptions);
  });
});
