import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { AddonOperationInvocationService } from '@osf/shared/services/addons/addon-operation-invocation.service';
import { AddonsService } from '@osf/shared/services/addons/addons.service';
import { CslStyleManagerService } from '@osf/shared/services/csl-style-manager.service';

import { AddonTreeItem } from '../../models';
import { CitationItemComponent } from '../citation-item/citation-item.component';

import { CitationCollectionItemComponent } from './citation-collection-item.component';

import { MOCK_CONFIGURED_ADDON } from '@testing/mocks/configured-addon.mock';
import { MOCK_COLLECTION_STORAGE_ITEM, MOCK_DOCUMENT_STORAGE_ITEM } from '@testing/mocks/storage-item.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { AddonOperationInvocationServiceMockFactory } from '@testing/providers/addon-operation-invocation.service.mock';
import { AddonsServiceMockFactory } from '@testing/providers/addons.service.mock';
import { CslStyleManagerServiceMockFactory } from '@testing/providers/csl-style-manager.service.mock';

describe('CitationCollectionItemComponent', () => {
  let component: CitationCollectionItemComponent;
  let fixture: ComponentFixture<CitationCollectionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CitationCollectionItemComponent,
        OSFTestingModule,
        ...MockComponents(IconComponent, CitationItemComponent),
      ],
      providers: [
        {
          provide: AddonOperationInvocationService,
          useFactory: AddonOperationInvocationServiceMockFactory,
        },
        {
          provide: AddonsService,
          useFactory: AddonsServiceMockFactory,
        },
        {
          provide: CslStyleManagerService,
          useFactory: CslStyleManagerServiceMockFactory,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationCollectionItemComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.componentRef.setInput('addon', MOCK_CONFIGURED_ADDON);
    fixture.componentRef.setInput('collection', MOCK_COLLECTION_STORAGE_ITEM);
    fixture.componentRef.setInput('selectedCitationStyle', 'apa');

    expect(component).toBeTruthy();
  });

  it('should initialize with required inputs', () => {
    fixture.componentRef.setInput('addon', MOCK_CONFIGURED_ADDON);
    fixture.componentRef.setInput('collection', MOCK_COLLECTION_STORAGE_ITEM);
    fixture.componentRef.setInput('selectedCitationStyle', 'apa');

    fixture.detectChanges();

    expect(component.addon()).toEqual(MOCK_CONFIGURED_ADDON);
    expect(component.collection()).toEqual(MOCK_COLLECTION_STORAGE_ITEM);
    expect(component.selectedCitationStyle()).toBe('apa');
    expect(component.level()).toBe(0);
  });

  it('should initialize treeItem in ngOnInit', () => {
    fixture.componentRef.setInput('addon', MOCK_CONFIGURED_ADDON);
    fixture.componentRef.setInput('collection', MOCK_COLLECTION_STORAGE_ITEM);
    fixture.componentRef.setInput('selectedCitationStyle', 'apa');

    fixture.detectChanges();

    expect(component.treeItem()).toEqual({
      item: MOCK_COLLECTION_STORAGE_ITEM,
      children: [],
      expanded: false,
      loading: false,
    });
  });

  describe('Computed signals', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('addon', MOCK_CONFIGURED_ADDON);
      fixture.componentRef.setInput('collection', MOCK_COLLECTION_STORAGE_ITEM);
      fixture.componentRef.setInput('selectedCitationStyle', 'apa');
      fixture.detectChanges();
    });

    it('should return correct isExpanded value', () => {
      expect(component.isExpanded()).toBe(false);

      component.treeItem.set({
        ...component.treeItem(),
        expanded: true,
      } as AddonTreeItem);

      expect(component.isExpanded()).toBe(true);
    });

    it('should return correct isLoading value', () => {
      expect(component.isLoading()).toBe(false);

      component.treeItem.set({
        ...component.treeItem(),
        loading: true,
      } as AddonTreeItem);

      expect(component.isLoading()).toBe(true);
    });

    it('should return children correctly', () => {
      const mockChildren = [
        {
          item: MOCK_DOCUMENT_STORAGE_ITEM,
          children: [],
          expanded: false,
          loading: false,
        },
      ];

      component.treeItem.set({
        ...component.treeItem(),
        children: mockChildren,
      } as AddonTreeItem);

      expect(component.children()).toEqual(mockChildren);
    });

    describe('collectionChildren', () => {
      it('should filter collection children correctly', () => {
        const mockChildren = [
          {
            item: MOCK_DOCUMENT_STORAGE_ITEM,
            children: [],
            expanded: false,
            loading: false,
          },
          {
            item: MOCK_COLLECTION_STORAGE_ITEM,
            children: [],
            expanded: false,
            loading: false,
          },
        ];

        component.treeItem.set({
          ...component.treeItem(),
          children: mockChildren,
        } as AddonTreeItem);

        const result = component.collectionChildren();

        expect(result).toHaveLength(1);
        expect(result[0].item).toEqual(MOCK_COLLECTION_STORAGE_ITEM);
      });

      it('should return empty array when no collection children', () => {
        const mockChildren = [
          {
            item: MOCK_DOCUMENT_STORAGE_ITEM,
            children: [],
            expanded: false,
            loading: false,
          },
        ];

        component.treeItem.set({
          ...component.treeItem(),
          children: mockChildren,
        } as AddonTreeItem);

        expect(component.collectionChildren()).toEqual([]);
      });
    });
  });
});
