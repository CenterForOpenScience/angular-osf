import { MockComponents, MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { InterpolatePipe } from '@osf/shared/pipes/interpolate.pipe';
import { SubjectsSelectors } from '@osf/shared/stores/subjects';

import { CitationSectionComponent } from '../citation-section/citation-section.component';

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
        ...MockComponents(CitationSectionComponent, LicenseDisplayComponent),
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
    fixture.componentRef.setInput('preprintProviderId', 'osf');
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

  it('should navigate to search page with tag when tagClicked is called', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.tagClicked('test-tag');

    expect(navigateSpy).toHaveBeenCalledWith(['/search'], {
      queryParams: { search: 'test-tag' },
    });
  });
});
