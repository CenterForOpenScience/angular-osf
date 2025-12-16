import { MockComponents } from 'ng-mocks';

import { SelectChangeEvent, SelectFilterEvent } from 'primeng/select';

import { of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationNames } from '@osf/shared/enums/operation-names.enum';
import { AddonOperationInvocationService } from '@osf/shared/services/addons/addon-operation-invocation.service';
import { CslStyleManagerService } from '@osf/shared/services/csl-style-manager.service';
import { AddonsSelectors } from '@osf/shared/stores/addons';
import { CitationsSelectors } from '@osf/shared/stores/citations';

import { DEFAULT_CITATION_STYLE } from '../../constants';
import { CitationCollectionItemComponent } from '../citation-collection-item/citation-collection-item.component';
import { CitationItemComponent } from '../citation-item/citation-item.component';

import { CitationAddonCardComponent } from './citation-addon-card.component';

import { MOCK_CONFIGURED_ADDON } from '@testing/mocks/configured-addon.mock';
import { MOCK_DOCUMENT_STORAGE_ITEM } from '@testing/mocks/storage-item.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { AddonOperationInvocationServiceMockFactory } from '@testing/providers/addon-operation-invocation.service.mock';
import { CslStyleManagerServiceMockFactory } from '@testing/providers/csl-style-manager.service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('CitationAddonCardComponent', () => {
  let component: CitationAddonCardComponent;
  let fixture: ComponentFixture<CitationAddonCardComponent>;
  let operationInvocationService: jest.Mocked<AddonOperationInvocationService>;
  let cslStyleManager: jest.Mocked<CslStyleManagerService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CitationAddonCardComponent,
        OSFTestingModule,
        ...MockComponents(CitationItemComponent, CitationCollectionItemComponent),
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: AddonsSelectors.getAllCitationOperationInvocations, value: signal({}) },
            { selector: CitationsSelectors.getCitationStyles, value: signal([]) },
            { selector: CitationsSelectors.getCitationStylesLoading, value: signal(false) },
          ],
        }),
        {
          provide: AddonOperationInvocationService,
          useFactory: AddonOperationInvocationServiceMockFactory,
        },
        {
          provide: CslStyleManagerService,
          useFactory: CslStyleManagerServiceMockFactory,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationAddonCardComponent);
    component = fixture.componentInstance;

    operationInvocationService = TestBed.inject(
      AddonOperationInvocationService
    ) as jest.Mocked<AddonOperationInvocationService>;
    cslStyleManager = TestBed.inject(CslStyleManagerService) as jest.Mocked<CslStyleManagerService>;
  });

  describe('Component initialization', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('addon', MOCK_CONFIGURED_ADDON);
      cslStyleManager.ensureStyleLoaded.mockReturnValue(of(undefined));
    });

    it('should initialize with required inputs', () => {
      fixture.detectChanges();

      expect(component.addon()).toEqual(MOCK_CONFIGURED_ADDON);
    });

    it('should initialize citation styles and load data on ngOnInit', () => {
      const mockPayload = { data: { type: 'test' } };
      operationInvocationService.createOperationInvocationPayload.mockReturnValue(mockPayload as any);

      fixture.detectChanges();

      expect(operationInvocationService.createOperationInvocationPayload).toHaveBeenCalledWith(
        MOCK_CONFIGURED_ADDON,
        OperationNames.LIST_COLLECTION_ITEMS,
        MOCK_CONFIGURED_ADDON.selectedStorageItemId
      );
      expect(cslStyleManager.ensureStyleLoaded).toHaveBeenCalledWith(DEFAULT_CITATION_STYLE);
    });
  });

  describe('Computed signals', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('addon', MOCK_CONFIGURED_ADDON);
      fixture.detectChanges();
    });

    it('should compute selectedCitationStyle with default value', () => {
      expect(component.selectedCitationStyle()).toBe(DEFAULT_CITATION_STYLE);
    });

    it('should compute isStyleLoading with default value', () => {
      expect(component.isStyleLoading()).toBe(false);
    });

    it('should format citation items with selected style', () => {
      const mockItems = [MOCK_DOCUMENT_STORAGE_ITEM];
      const style = 'apa';

      cslStyleManager.formatCitation.mockReturnValue('Formatted Citation');

      const result = mockItems.map((item) => ({
        item,
        formattedCitation: cslStyleManager.formatCitation(item, style),
        itemUrl: 'https://example.com/doc1',
      }));

      expect(result[0].formattedCitation).toBe('Formatted Citation');
      expect(cslStyleManager.formatCitation).toHaveBeenCalledWith(MOCK_DOCUMENT_STORAGE_ITEM, style);
    });
  });

  describe('Event handlers', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('addon', MOCK_CONFIGURED_ADDON);
      fixture.detectChanges();
    });

    it('should handle citation style filter search', () => {
      const mockEvent = {
        originalEvent: { preventDefault: jest.fn() },
        filter: 'test filter',
      } as unknown as SelectFilterEvent;

      component.handleCitationStyleFilterSearch(mockEvent);

      expect(mockEvent.originalEvent.preventDefault).toHaveBeenCalled();
    });

    it('should handle citation style change', () => {
      const mockEvent = {
        value: { id: 'new-style' },
      } as SelectChangeEvent;

      cslStyleManager.ensureStyleLoaded.mockReturnValue(of(undefined));

      component.handleCitationStyleChange(mockEvent);

      expect(cslStyleManager.ensureStyleLoaded).toHaveBeenCalledWith('new-style');
    });
  });
});
