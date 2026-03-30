import { MockComponent, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderReviewsWorkflow } from '@osf/features/preprints/enums';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { IS_LARGE, IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';
import { FileVersionModel } from '@shared/models/files/file-version.model';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { PreprintFileSectionComponent } from './preprint-file-section.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { DataciteServiceMockBuilder, DataciteServiceMockType } from '@testing/providers/datacite.service.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintFileSectionComponent', () => {
  let component: PreprintFileSectionComponent;
  let fixture: ComponentFixture<PreprintFileSectionComponent>;
  let dataciteService: DataciteServiceMockType;
  let isMediumSubject: BehaviorSubject<boolean>;
  let isLargeSubject: BehaviorSubject<boolean>;

  const mockPreprint = PREPRINT_MOCK;
  const mockFile = {
    id: 'file-1',
    name: 'test-file.pdf',
    links: {
      render: 'https://example.com/render',
    },
  };
  const mockFileVersions: FileVersionModel[] = [
    {
      id: '1',
      size: 100,
      name: 'test-file-v1.pdf',
      dateCreated: new Date('2024-01-15T10:00:00Z'),
      downloadLink: 'https://example.com/download/1',
    },
    {
      id: '2',
      size: 200,
      name: 'test-file-v2.pdf',
      dateCreated: new Date('2024-01-16T10:00:00Z'),
      downloadLink: 'https://example.com/download/2',
    },
  ];

  interface SetupOverrides extends BaseSetupOverrides {
    providerReviewsWorkflow?: ProviderReviewsWorkflow | null;
  }

  function setup(overrides: SetupOverrides = {}) {
    isMediumSubject = new BehaviorSubject<boolean>(false);
    isLargeSubject = new BehaviorSubject<boolean>(true);
    dataciteService = DataciteServiceMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [PreprintFileSectionComponent, MockComponent(LoadingSpinnerComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(DataciteService, dataciteService),
        MockProvider(IS_MEDIUM, isMediumSubject),
        MockProvider(IS_LARGE, isLargeSubject),
        provideMockStore({
          signals: mergeSignalOverrides(
            [
              { selector: PreprintSelectors.getPreprint, value: mockPreprint },
              { selector: PreprintSelectors.getPreprintFile, value: mockFile },
              { selector: PreprintSelectors.isPreprintFileLoading, value: false },
              { selector: PreprintSelectors.getPreprintFileVersions, value: mockFileVersions },
              { selector: PreprintSelectors.arePreprintFileVersionsLoading, value: false },
            ],
            overrides.selectorOverrides
          ),
        }),
      ],
    });

    fixture = TestBed.createComponent(PreprintFileSectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'providerReviewsWorkflow',
      overrides.providerReviewsWorkflow ?? ProviderReviewsWorkflow.PreModeration
    );
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should expose selector signals', () => {
    setup();
    expect(component.preprint()).toBe(mockPreprint);
    expect(component.file()).toBe(mockFile);
    expect(component.isFileLoading()).toBe(false);
    expect(component.fileVersions()).toBe(mockFileVersions);
    expect(component.areFileVersionsLoading()).toBe(false);
  });

  it('should compute safe link from file render link', () => {
    setup();
    const safeLink = component.safeLink();
    expect(safeLink).toBe('https://example.com/render');
  });

  it('should return null safe link when render link is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintSelectors.getPreprintFile, value: { ...mockFile, links: {} } }],
    });
    expect(component.safeLink()).toBeNull();
  });

  it('should compute version menu items from file versions', () => {
    setup();
    const menuItems = component.versionMenuItems();
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0].label).toBeTruthy();
    expect(menuItems[0].url).toBe('https://example.com/download/1');
    expect(menuItems[0].command).toBeDefined();
  });

  it('should return empty array when no file versions', () => {
    setup();
    jest.spyOn(component, 'fileVersions').mockReturnValue([]);
    const menuItems = component.versionMenuItems();
    expect(menuItems).toEqual([]);
  });

  it('should return empty array when file versions are undefined', () => {
    setup();
    jest.spyOn(component, 'fileVersions').mockReturnValue(undefined as unknown as typeof mockFileVersions);
    const menuItems = component.versionMenuItems();
    expect(menuItems).toEqual([]);
  });

  it('should compute date label for pre-moderation workflow', () => {
    setup({ providerReviewsWorkflow: ProviderReviewsWorkflow.PreModeration });
    const label = component.dateLabel();
    expect(label).toBe('preprints.details.file.submitted');
  });

  it('should return created label for non-pre-moderation workflows', () => {
    setup({ providerReviewsWorkflow: ProviderReviewsWorkflow.PostModeration });
    expect(component.dateLabel()).toBe('preprints.details.file.created');
    fixture.componentRef.setInput('providerReviewsWorkflow', null);
    const label = component.dateLabel();
    expect(label).toBe('preprints.details.file.created');
  });

  it('should call dataciteService.logIdentifiableDownload when logDownload is called', () => {
    setup();
    component.logDownload();
    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(component.preprint$);
  });

  it('should call logDownload when version menu item command is executed', () => {
    setup();
    const menuItems = component.versionMenuItems();
    expect(menuItems.length).toBeGreaterThan(0);

    const versionCommand = menuItems[0].command!;
    jest.spyOn(component, 'logDownload');

    versionCommand();

    expect(component.logDownload).toHaveBeenCalled();
    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(expect.anything());
  });

  it('should handle isMedium signal', () => {
    setup();
    const isMedium = component.isMedium();
    expect(typeof isMedium).toBe('boolean');
  });

  it('should handle isLarge signal', () => {
    setup();
    const isLarge = component.isLarge();
    expect(typeof isLarge).toBe('boolean');
  });
});
