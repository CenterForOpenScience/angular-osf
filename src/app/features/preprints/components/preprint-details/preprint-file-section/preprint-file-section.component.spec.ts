import { MockComponent, MockProvider } from 'ng-mocks';

import { BehaviorSubject, of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderReviewsWorkflow } from '@osf/features/preprints/enums';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { IS_LARGE, IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { PreprintFileSectionComponent } from './preprint-file-section.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintFileSectionComponent', () => {
  let component: PreprintFileSectionComponent;
  let fixture: ComponentFixture<PreprintFileSectionComponent>;
  let dataciteService: jest.Mocked<DataciteService>;
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
  const mockFileVersions = [
    {
      id: '1',
      dateCreated: '2024-01-15T10:00:00Z',
      downloadLink: 'https://example.com/download/1',
    },
    {
      id: '2',
      dateCreated: '2024-01-16T10:00:00Z',
      downloadLink: 'https://example.com/download/2',
    },
  ];

  beforeEach(async () => {
    isMediumSubject = new BehaviorSubject<boolean>(false);
    isLargeSubject = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      imports: [PreprintFileSectionComponent, OSFTestingModule, MockComponent(LoadingSpinnerComponent)],
      providers: [
        TranslationServiceMock,
        {
          provide: DataciteService,
          useValue: {
            logIdentifiableDownload: jest.fn().mockReturnValue(of(void 0)),
          },
        },
        MockProvider(IS_MEDIUM, isMediumSubject),
        MockProvider(IS_LARGE, isLargeSubject),
        provideMockStore({
          signals: [
            {
              selector: PreprintSelectors.getPreprint,
              value: mockPreprint,
            },
            {
              selector: PreprintSelectors.getPreprintFile,
              value: mockFile,
            },
            {
              selector: PreprintSelectors.isPreprintFileLoading,
              value: false,
            },
            {
              selector: PreprintSelectors.getPreprintFileVersions,
              value: mockFileVersions,
            },
            {
              selector: PreprintSelectors.arePreprintFileVersionsLoading,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintFileSectionComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('providerReviewsWorkflow', ProviderReviewsWorkflow.PreModeration);

    dataciteService = TestBed.inject(DataciteService) as jest.MockedObject<DataciteService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return preprint from store', () => {
    const preprint = component.preprint();
    expect(preprint).toBe(mockPreprint);
  });

  it('should return file from store', () => {
    const file = component.file();
    expect(file).toBe(mockFile);
  });

  it('should return file loading state from store', () => {
    const loading = component.isFileLoading();
    expect(loading).toBe(false);
  });

  it('should return file versions from store', () => {
    const versions = component.fileVersions();
    expect(versions).toBe(mockFileVersions);
  });

  it('should return file versions loading state from store', () => {
    const loading = component.areFileVersionsLoading();
    expect(loading).toBe(false);
  });

  it('should compute safe link from file render link', () => {
    const safeLink = component.safeLink();
    expect(safeLink).toBeDefined();
  });

  it('should compute version menu items from file versions', () => {
    const menuItems = component.versionMenuItems();
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveProperty('label');
    expect(menuItems[0]).toHaveProperty('url');
    expect(menuItems[0]).toHaveProperty('command');
  });

  it('should return empty array when no file versions', () => {
    jest.spyOn(component, 'fileVersions').mockReturnValue([]);
    const menuItems = component.versionMenuItems();
    expect(menuItems).toEqual([]);
  });

  it('should compute date label for pre-moderation workflow', () => {
    const label = component.dateLabel();
    expect(label).toBe('preprints.details.file.submitted');
  });

  it('should compute date label for post-moderation workflow', () => {
    fixture.componentRef.setInput('providerReviewsWorkflow', ProviderReviewsWorkflow.PostModeration);
    const label = component.dateLabel();
    expect(label).toBe('preprints.details.file.created');
  });

  it('should return created label when no reviews workflow', () => {
    fixture.componentRef.setInput('providerReviewsWorkflow', null);
    const label = component.dateLabel();
    expect(label).toBe('preprints.details.file.created');
  });

  it('should call dataciteService.logIdentifiableDownload when logDownload is called', () => {
    component.logDownload();
    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(component.preprint$);
  });

  it('should call logDownload when version menu item command is executed', () => {
    const menuItems = component.versionMenuItems();
    expect(menuItems.length).toBeGreaterThan(0);

    const versionCommand = menuItems[0].command!;
    jest.spyOn(component, 'logDownload');

    versionCommand();

    expect(component.logDownload).toHaveBeenCalled();
    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(expect.anything());
  });

  it('should handle isMedium signal', () => {
    const isMedium = component.isMedium();
    expect(typeof isMedium).toBe('boolean');
  });

  it('should handle isLarge signal', () => {
    const isLarge = component.isLarge();
    expect(typeof isLarge).toBe('boolean');
  });
});
