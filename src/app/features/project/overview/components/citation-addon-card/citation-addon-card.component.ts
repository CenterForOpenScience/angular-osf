import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Select, SelectChangeEvent, SelectFilterEvent } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OperationNames } from '@osf/shared/enums/operation-names.enum';
import { StorageItemType } from '@osf/shared/enums/storage-item-type.enum';
import { formatCitation, getItemUrl } from '@osf/shared/helpers/citation-formatter.helper';
import { ConfiguredAddonModel } from '@osf/shared/models/addons/configured-addon.model';
import { StorageItem } from '@osf/shared/models/addons/storage-item.model';
import { CitationStyle } from '@osf/shared/models/citations/citation-style.model';
import { CustomOption } from '@osf/shared/models/select-option.model';
import { AddonOperationInvocationService } from '@osf/shared/services/addons/addon-operation-invocation.service';
import { CslStyleManagerService } from '@osf/shared/services/csl-style-manager.service';
import { AddonsSelectors, CreateCitationAddonOperationInvocation } from '@osf/shared/stores/addons';
import { CitationsSelectors, GetCitationStyles } from '@osf/shared/stores/citations';

import '@citation-js/plugin-csl';

import { DEFAULT_CITATION_STYLE } from '../../constants';
import { FormattedCitationItem } from '../../models';
import { CitationCollectionItemComponent } from '../citation-collection-item/citation-collection-item.component';
import { CitationItemComponent } from '../citation-item/citation-item.component';

@Component({
  selector: 'osf-citation-addon-card',
  imports: [Select, TranslatePipe, CitationItemComponent, CitationCollectionItemComponent, Skeleton],
  templateUrl: './citation-addon-card.component.html',
  styleUrl: './citation-addon-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationAddonCardComponent implements OnInit {
  private readonly operationInvocationService = inject(AddonOperationInvocationService);
  private readonly cslStyleManager = inject(CslStyleManagerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly filterSubject = new Subject<string>();

  readonly addon = input.required<ConfiguredAddonModel>();

  readonly allCitationOperationInvocations = select(AddonsSelectors.getAllCitationOperationInvocations);

  readonly operationInvocation = computed(() => {
    const addonId = this.addon().id;
    const invocations = this.allCitationOperationInvocations();
    return invocations[addonId]?.data ?? null;
  });

  readonly isOperationInvocationSubmitting = computed(() => {
    const addonId = this.addon().id;
    const invocations = this.allCitationOperationInvocations();
    return invocations[addonId]?.isSubmitting ?? false;
  });

  readonly citationStyles = select(CitationsSelectors.getCitationStyles);
  readonly isCitationStylesLoading = select(CitationsSelectors.getCitationStylesLoading);

  readonly citationStylesOptions = signal<CustomOption<CitationStyle>[]>([]);
  readonly selectedCitationStyle = signal<string>(DEFAULT_CITATION_STYLE);
  readonly isStyleLoading = signal<boolean>(false);

  readonly filterMessage = computed(() =>
    this.isCitationStylesLoading()
      ? 'project.overview.metadata.citationLoadingPlaceholder'
      : 'project.overview.metadata.noCitationStylesFound'
  );

  readonly actions = createDispatchMap({
    createCitationAddonOperationInvocation: CreateCitationAddonOperationInvocation,
    getCitationStyles: GetCitationStyles,
  });

  readonly collectionItems = computed<StorageItem[]>(() => {
    const invocation = this.operationInvocation();
    const result = invocation?.operationResult ?? [];
    return result.filter((item) => item.itemType === StorageItemType.Collection);
  });

  readonly citationItems = computed<StorageItem[]>(() => {
    const invocation = this.operationInvocation();
    const result = invocation?.operationResult ?? [];
    return result.filter((item) => item.itemType === StorageItemType.Document && !!item.csl);
  });

  readonly formattedCitationItems = computed<FormattedCitationItem[]>(() => {
    const items = this.citationItems();
    const style = this.selectedCitationStyle();

    return items.map((item) => ({
      item,
      formattedCitation: formatCitation(item, style),
      itemUrl: getItemUrl(item),
    }));
  });

  constructor() {
    this.setupFilterDebounce();
    this.setupCitationStylesEffect();
    this.setupCleanup();
  }

  ngOnInit(): void {
    this.loadCitationData();
    this.initializeCitationStyles();
  }

  private loadCitationData(): void {
    const addon = this.addon();
    const payload = this.operationInvocationService.createOperationInvocationPayload(
      addon,
      OperationNames.LIST_COLLECTION_ITEMS,
      addon.selectedStorageItemId
    );

    this.actions.createCitationAddonOperationInvocation(payload, addon.id);
  }

  private initializeCitationStyles(): void {
    this.actions.getCitationStyles('');
    this.cslStyleManager
      .ensureStyleLoaded(DEFAULT_CITATION_STYLE)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  handleCitationStyleFilterSearch(event: SelectFilterEvent): void {
    event.originalEvent.preventDefault();
    this.filterSubject.next(event.filter);
  }

  handleCitationStyleChange(event: SelectChangeEvent): void {
    const styleId = event.value.id;
    this.loadCitationStyle(styleId);
  }

  private loadCitationStyle(styleId: string): void {
    this.isStyleLoading.set(true);

    this.cslStyleManager
      .ensureStyleLoaded(styleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.onStyleLoadSuccess(styleId),
        error: () => this.onStyleLoadError(styleId),
      });
  }

  private onStyleLoadSuccess(styleId: string): void {
    this.selectedCitationStyle.set(styleId);
    this.isStyleLoading.set(false);
  }

  private onStyleLoadError(styleId: string): void {
    this.selectedCitationStyle.set(styleId);
    this.isStyleLoading.set(false);
  }

  private setupFilterDebounce(): void {
    this.filterSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
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
      this.cslStyleManager.clearCache();
    });
  }
}
