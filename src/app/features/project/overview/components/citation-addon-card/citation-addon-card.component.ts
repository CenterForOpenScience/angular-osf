import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Select, SelectChangeEvent, SelectFilterEvent } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

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

import { OperationNames, StorageItemType } from '@osf/shared/enums';
import { CitationStyle, ConfiguredAddonModel, CustomOption, StorageItem } from '@osf/shared/models';
import { AddonOperationInvocationService, CslStyleManagerService } from '@osf/shared/services';
import { CitationsSelectors, GetCitationStyles } from '@osf/shared/stores';
import { AddonsSelectors, CreateAddonOperationInvocation } from '@osf/shared/stores/addons';

import '@citation-js/plugin-csl';

import { CitationCollectionItemComponent } from '../citation-collection-item/citation-collection-item.component';
import { CitationItemComponent } from '../citation-item/citation-item.component';

import { Cite } from '@citation-js/core';

@Component({
  selector: 'osf-citation-addon-card',
  imports: [Select, TranslatePipe, CitationItemComponent, CitationCollectionItemComponent, Skeleton],
  templateUrl: './citation-addon-card.component.html',
  styleUrl: './citation-addon-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationAddonCardComponent implements OnInit {
  private operationInvocationService = inject(AddonOperationInvocationService);
  private cslStyleManager = inject(CslStyleManagerService);
  private destroyRef = inject(DestroyRef);
  private filterSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  addon = input.required<ConfiguredAddonModel>();

  operationInvocation = select(AddonsSelectors.getOperationInvocation);
  isOperationInvocationSubmitting = select(AddonsSelectors.getOperationInvocationSubmitting);
  citationStyles = select(CitationsSelectors.getCitationStyles);
  isCitationStylesLoading = select(CitationsSelectors.getCitationStylesLoading);

  citationStylesOptions = signal<CustomOption<CitationStyle>[]>([]);
  selectedCitationStyle = signal<string>('apa');
  isStyleLoading = signal<boolean>(false);

  filterMessage = computed(() =>
    this.isCitationStylesLoading()
      ? 'project.overview.metadata.citationLoadingPlaceholder'
      : 'project.overview.metadata.noCitationStylesFound'
  );

  actions = createDispatchMap({
    createAddonOperationInvocation: CreateAddonOperationInvocation,
    getCitationStyles: GetCitationStyles,
  });

  collectionItems = computed<StorageItem[]>(() => {
    const invocation = this.operationInvocation();
    if (!invocation || !invocation.operationResult) {
      return [];
    }
    return invocation.operationResult.filter((item) => item.itemType === StorageItemType.Collection);
  });

  citationItems = computed<StorageItem[]>(() => {
    const invocation = this.operationInvocation();
    if (!invocation || !invocation.operationResult) {
      return [];
    }
    return invocation.operationResult.filter((item) => item.itemType === StorageItemType.Document && item.csl);
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

    this.cslStyleManager.ensureStyleLoaded('apa').pipe(takeUntil(this.destroy$)).subscribe();
  }

  handleCitationStyleFilterSearch(event: SelectFilterEvent): void {
    event.originalEvent.preventDefault();
    this.filterSubject.next(event.filter);
  }

  handleCitationStyleChange(event: SelectChangeEvent): void {
    const styleId = event.value.id;
    this.isStyleLoading.set(true);

    this.cslStyleManager
      .ensureStyleLoaded(styleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.selectedCitationStyle.set(styleId);
          this.isStyleLoading.set(false);
        },
        error: () => {
          this.isStyleLoading.set(false);
          this.selectedCitationStyle.set(styleId);
        },
      });
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

  getItemUrl(item: StorageItem): string {
    return (item.csl?.['URL'] as string) || '';
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
      this.cslStyleManager.clearCache();
    });
  }
}
