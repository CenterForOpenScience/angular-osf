import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';

import { IconComponent } from '@shared/components';
import { OperationNames, StorageItemType } from '@shared/enums';
import { formatCitation, getItemUrl } from '@shared/helpers';
import { ConfiguredAddonModel, OperationInvocation, StorageItem } from '@shared/models';
import { AddonOperationInvocationService, AddonsService } from '@shared/services';

import { AddonTreeItem, FormattedCitationItem } from '../../models';
import { CitationItemComponent } from '../citation-item/citation-item.component';

@Component({
  selector: 'osf-citation-collection-item',
  imports: [IconComponent, CitationItemComponent],
  templateUrl: './citation-collection-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationCollectionItemComponent implements OnInit {
  private readonly operationInvocationService = inject(AddonOperationInvocationService);
  private readonly addonsService = inject(AddonsService);

  readonly addon = input.required<ConfiguredAddonModel>();
  readonly collection = input.required<StorageItem>();
  readonly level = input<number>(0);
  readonly selectedCitationStyle = input.required<string>();

  readonly treeItem = signal<AddonTreeItem | null>(null);

  readonly isExpanded = computed(() => this.treeItem()?.expanded ?? false);
  readonly isLoading = computed(() => this.treeItem()?.loading ?? false);
  readonly children = computed(() => this.treeItem()?.children ?? []);

  readonly formattedDocumentChildren = computed<FormattedCitationItem[]>(() => {
    const children = this.children();
    const style = this.selectedCitationStyle();

    return children
      .filter((child) => this.isDocument(child.item))
      .map((child) => ({
        item: child.item,
        formattedCitation: formatCitation(child.item, style),
        itemUrl: getItemUrl(child.item),
      }));
  });

  readonly collectionChildren = computed<AddonTreeItem[]>(() => {
    const children = this.children();
    return children.filter((child) => this.isCollection(child.item));
  });

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
      this.collapseItem(currentItem);
      return;
    }

    if (currentItem.children.length === 0) {
      this.loadAndExpandChildren(currentItem);
    } else {
      this.expandItem(currentItem);
    }
  }

  private collapseItem(item: AddonTreeItem): void {
    this.treeItem.set({
      ...item,
      expanded: false,
    });
  }

  private expandItem(item: AddonTreeItem): void {
    this.treeItem.set({
      ...item,
      expanded: true,
    });
  }

  private loadAndExpandChildren(item: AddonTreeItem): void {
    this.setLoadingState(item, true);

    const payload = this.createLoadChildrenPayload();

    this.addonsService.createAddonOperationInvocation(payload).subscribe({
      next: (result) => this.handleChildrenLoadSuccess(item, result),
      error: () => this.handleChildrenLoadError(item),
    });
  }

  private createLoadChildrenPayload() {
    return this.operationInvocationService.createOperationInvocationPayload(
      this.addon(),
      OperationNames.LIST_COLLECTION_ITEMS,
      this.collection().itemId || ''
    );
  }

  private handleChildrenLoadSuccess(currentItem: AddonTreeItem, result: Partial<OperationInvocation>): void {
    if (result?.operationResult) {
      const children = this.mapResultToTreeItems(result.operationResult);
      this.treeItem.set({
        ...currentItem,
        children,
        expanded: true,
        loading: false,
      });
    }
  }

  private handleChildrenLoadError(currentItem: AddonTreeItem): void {
    this.setLoadingState(currentItem, false);
  }

  private setLoadingState(item: AddonTreeItem, loading: boolean): void {
    this.treeItem.set({
      ...item,
      loading,
    });
  }

  private mapResultToTreeItems(items: StorageItem[]): AddonTreeItem[] {
    return items.map((item) => ({
      item,
      children: [],
      expanded: false,
      loading: false,
    }));
  }

  private isCollection(item: StorageItem): boolean {
    return item.itemType === StorageItemType.Collection;
  }

  private isDocument(item: StorageItem): boolean {
    return item.itemType === StorageItemType.Document && !!item.csl;
  }
}
