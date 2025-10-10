import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';

import { IconComponent } from '@shared/components';
import { OperationNames, StorageItemType } from '@shared/enums';
import { ConfiguredAddonModel, StorageItem } from '@shared/models';
import { AddonOperationInvocationService, AddonsService } from '@shared/services';

import { CitationItemComponent } from '../citation-item/citation-item.component';

import { Cite } from '@citation-js/core';

export interface TreeItem {
  item: StorageItem;
  children: TreeItem[];
  expanded: boolean;
  loading: boolean;
}

@Component({
  selector: 'osf-citation-collection-item',
  imports: [IconComponent, CitationItemComponent],
  templateUrl: './citation-collection-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationCollectionItemComponent implements OnInit {
  private operationInvocationService = inject(AddonOperationInvocationService);
  private addonsService = inject(AddonsService);

  addon = input.required<ConfiguredAddonModel>();
  collection = input.required<StorageItem>();
  level = input<number>(0);
  selectedCitationStyle = input.required<string>();

  treeItem = signal<TreeItem | null>(null);

  isExpanded = computed(() => this.treeItem()?.expanded || false);
  isLoading = computed(() => this.treeItem()?.loading || false);
  children = computed(() => this.treeItem()?.children || []);

  ngOnInit(): void {
    this.treeItem.set({
      item: this.collection(),
      children: [],
      expanded: false,
      loading: false,
    });
  }

  toggleExpand(): void {
    const currentItem = this.treeItem();
    if (!currentItem) return;

    if (currentItem.expanded) {
      this.treeItem.set({
        ...currentItem,
        expanded: false,
      });
      return;
    }

    if (currentItem.children.length === 0) {
      this.treeItem.set({
        ...currentItem,
        loading: true,
      });

      const payload = this.operationInvocationService.createOperationInvocationPayload(
        this.addon(),
        OperationNames.LIST_COLLECTION_ITEMS,
        this.collection().itemId || ''
      );

      this.addonsService.createAddonOperationInvocation(payload).subscribe({
        next: (result) => {
          if (result && result.operationResult) {
            const children = result.operationResult.map((item) => ({
              item,
              children: [],
              expanded: false,
              loading: false,
            }));

            this.treeItem.set({
              ...currentItem,
              children,
              expanded: true,
              loading: false,
            });
          }
        },
        error: () => {
          this.treeItem.set({
            ...currentItem,
            loading: false,
          });
        },
      });
    } else {
      this.treeItem.set({
        ...currentItem,
        expanded: true,
      });
    }
  }

  formatCitation(item: StorageItem, style: string): string {
    if (!item.csl) return item.itemName || '';

    const cite = new Cite(item.csl);
    const citation = cite.format('bibliography', {
      format: 'text',
      template: style,
      lang: 'en-US',
    });
    return citation.trim();
  }

  isCollection(item: StorageItem): boolean {
    return item.itemType === StorageItemType.Collection;
  }

  isDocument(item: StorageItem): boolean {
    return item.itemType === StorageItemType.Document && !!item.csl;
  }

  getItemUrl(item: StorageItem): string {
    return (item.csl?.['URL'] as string) || '';
  }
}
