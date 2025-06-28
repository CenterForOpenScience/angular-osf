import {
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { ReusableFilterType } from '@shared/enums';
import { DiscoverableFilter } from '@shared/mappers/filters';

export interface FilterTemplateContext {
  $implicit: DiscoverableFilter;
  filter: DiscoverableFilter;
  isVisible: boolean;
}

@Directive({
  selector: '[osfFilterItem]',
})
export class FilterItemDirective implements OnChanges {
  private readonly templateRef = inject(TemplateRef<FilterTemplateContext>);
  private readonly viewContainer = inject(ViewContainerRef);

  private embeddedView: EmbeddedViewRef<FilterTemplateContext> | null = null;

  @Input() osfFilterItem!: ReusableFilterType;
  @Input() osfFilterItemFrom: DiscoverableFilter[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['osfFilterItem'] || changes['osfFilterItemFrom']) {
      this.updateView();
    }
  }

  private updateView(): void {
    const filter = this.getFilter();
    const shouldShow = this.shouldShowFilter(filter);

    if (shouldShow && filter) {
      if (this.embeddedView) {
        // Update existing view context
        this.embeddedView.context.$implicit = filter;
        this.embeddedView.context.filter = filter;
        this.embeddedView.context.isVisible = true;
      } else {
        // Create new view
        this.embeddedView = this.viewContainer.createEmbeddedView(this.templateRef, {
          $implicit: filter,
          filter: filter,
          isVisible: true,
        });
      }
    } else {
      // Clear view if should not show
      if (this.embeddedView) {
        this.viewContainer.clear();
        this.embeddedView = null;
      }
    }
  }

  private getFilter(): DiscoverableFilter | undefined {
    if (!this.osfFilterItemFrom?.length || !this.osfFilterItem) {
      return undefined;
    }
    return this.osfFilterItemFrom.find((f) => f.key === this.osfFilterItem);
  }

  private shouldShowFilter(filter: DiscoverableFilter | undefined): boolean {
    if (!filter) {
      return false;
    }

    // Show filter if it has a result count > 0 or if it has options or hasOptions is true
    return (
      (filter.resultCount && filter.resultCount > 0) ||
      (filter.options && filter.options.length > 0) ||
      filter.hasOptions === true
    );
  }
}
