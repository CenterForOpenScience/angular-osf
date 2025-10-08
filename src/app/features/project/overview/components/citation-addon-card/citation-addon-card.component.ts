import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Select, SelectChangeEvent, SelectFilterEvent } from 'primeng/select';

import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';

import { OperationNames } from '@osf/shared/enums';
import { CitationStyle, ConfiguredAddonModel, CustomOption, StorageItem } from '@osf/shared/models';
import { AddonOperationInvocationService } from '@osf/shared/services';
import { CitationsSelectors, GetCitationStyles } from '@osf/shared/stores';
import { AddonsSelectors, CreateAddonOperationInvocation } from '@osf/shared/stores/addons';
import { IconComponent } from '@shared/components';

import '@citation-js/plugin-csl';

import { Cite } from '@citation-js/core';

@Component({
  selector: 'osf-citation-addon-card',
  imports: [Select, TranslatePipe, IconComponent],
  templateUrl: './citation-addon-card.component.html',
  styleUrl: './citation-addon-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationAddonCardComponent implements OnInit {
  private operationInvocationService = inject(AddonOperationInvocationService);
  private destroyRef = inject(DestroyRef);
  private filterSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  addon = input.required<ConfiguredAddonModel>();

  operationInvocation = select(AddonsSelectors.getOperationInvocation);
  citationStyles = select(CitationsSelectors.getCitationStyles);
  isCitationStylesLoading = select(CitationsSelectors.getCitationStylesLoading);

  citationStylesOptions = signal<CustomOption<CitationStyle>[]>([]);
  selectedCitationStyle = signal<string>('apa');

  filterMessage = computed(() =>
    this.isCitationStylesLoading()
      ? 'project.overview.metadata.citationLoadingPlaceholder'
      : 'project.overview.metadata.noCitationStylesFound'
  );

  actions = createDispatchMap({
    createAddonOperationInvocation: CreateAddonOperationInvocation,
    getCitationStyles: GetCitationStyles,
  });

  citationItems = computed<StorageItem[]>(() => {
    const invocation = this.operationInvocation();
    if (!invocation || !invocation.operationResult) {
      return [];
    }
    return invocation.operationResult.filter((item) => item.csl);
  });

  formattedCitations = computed(() => {
    const items = this.citationItems();
    const style = this.selectedCitationStyle();

    return items.map((item) => ({
      itemId: item.itemId,
      citation: this.formatCitation(item, style),
    }));
  });

  constructor() {
    this.setupFilterDebounce();
    this.setupCitationStylesEffect();
    this.setupCleanup();
  }

  ngOnInit(): void {
    const addon = this.addon();
    const payload = this.operationInvocationService.createOperationInvocationPayload(
      addon,
      OperationNames.LIST_COLLECTION_ITEMS,
      addon.selectedStorageItemId
    );

    this.actions.createAddonOperationInvocation(payload);
    this.actions.getCitationStyles('');
  }

  handleCitationStyleFilterSearch(event: SelectFilterEvent): void {
    event.originalEvent.preventDefault();
    this.filterSubject.next(event.filter);
  }

  handleCitationStyleChange(event: SelectChangeEvent): void {
    this.selectedCitationStyle.set(event.value.id);
  }

  private formatCitation(item: StorageItem, style: string): string {
    if (!item.csl) return item.itemName || '';

    const cite = new Cite(item.csl);
    const citation = cite.format('bibliography', {
      format: 'text',
      template: style,
      lang: 'en-US',
    });
    return citation.trim();
  }

  private setupFilterDebounce(): void {
    this.filterSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((filterValue) => {
        this.actions.getCitationStyles(filterValue);
      });
  }

  private setupCitationStylesEffect(): void {
    effect(() => {
      const styles = this.citationStyles();

      const options = styles.map((style: CitationStyle) => ({
        label: style.title,
        value: style,
      }));
      this.citationStylesOptions.set(options);
    });
  }

  private setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    });
  }
}
