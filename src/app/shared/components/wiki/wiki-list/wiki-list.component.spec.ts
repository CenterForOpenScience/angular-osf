import { MockProvider } from 'ng-mocks';

import { MenuItem } from 'primeng/api';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { WikiItemType } from '@osf/shared/enums/wiki-type.enum';
import { WikiModel } from '@osf/shared/models/wiki/wiki.model';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ComponentWiki } from '@osf/shared/stores/wiki';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

import { WikiListComponent } from './wiki-list.component';

describe('WikiListComponent', () => {
  let component: WikiListComponent;
  let fixture: ComponentFixture<WikiListComponent>;
  let mockCustomConfirmationService: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;

  const mockWikiList: WikiModel[] = [
    { id: 'wiki1', name: 'Home', kind: 'Home content' },
    { id: 'wiki2', name: 'Getting Started', kind: 'Getting started content' },
    { id: 'wiki3', name: 'API Documentation', kind: 'API docs' },
  ];

  const mockComponentsList: ComponentWiki[] = [
    {
      id: 'comp1',
      title: 'Component 1',
      list: mockWikiList,
    },
    {
      id: 'comp2',
      title: 'Component 2',
      list: mockWikiList,
    },
  ];

  const defaultSignals: SignalOverride[] = [{ selector: UserSelectors.isProjectReadOnly, value: false }];

  function setup({ selectorOverrides = defaultSignals } = {}) {
    mockCustomConfirmationService = CustomConfirmationServiceMockBuilder.create().build();
    mockRouter = RouterMockBuilder.create().withUrl('/project/abc123/wiki').build();

    const signals = mergeSignalOverrides(defaultSignals, selectorOverrides ?? []);
    TestBed.configureTestingModule({
      imports: [WikiListComponent],
      providers: [
        provideOSFCore(),
        MockProvider(CustomDialogService),
        MockProvider(CustomConfirmationService, mockCustomConfirmationService),
        MockProvider(Router, mockRouter),
        provideMockStore({ signals }),
      ],
    });

    fixture = TestBed.createComponent(WikiListComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have all required inputs', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', mockComponentsList);
    fixture.detectChanges();

    expect(component.list()).toEqual(mockWikiList);
    expect(component.resourceId()).toBe('resource-123');
    expect(component.currentWikiId()).toBe('wiki1');
    expect(component.componentsList()).toEqual(mockComponentsList);
  });

  it('should have default values for optional inputs', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.canEdit()).toBe(false);
  });

  it('should have WikiItemType enum available', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.wikiItemType).toBe(WikiItemType);
  });

  it('should have expanded signal initialized to true', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.expanded()).toBe(true);
  });

  it('should compute hasComponentsWikis correctly', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', mockComponentsList);
    fixture.detectChanges();

    expect(component.hasComponentsWikis()).toBe(true);
  });

  it('should compute hasComponentsWikis as false when empty', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.hasComponentsWikis()).toBe(false);
  });

  it('should compute isHomeWikiSelected correctly when home wiki is selected', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.isHomeWikiSelected()).toBe(true);
  });

  it('should compute isHomeWikiSelected as false when other wiki is selected', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki2');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.isHomeWikiSelected()).toBe(false);
  });

  it('should compute homeWikiId correctly', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.homeWikiId()).toBe('wiki1');
  });

  it('should return true for canEditName when user can edit and item is not home', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();

    const nonHomeItem = { id: 'wiki2' } as MenuItem;
    expect(component.canEditName(nonHomeItem)).toBe(true);
  });

  it('should return false for canEditName when item is home wiki', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();

    const homeItem = { id: 'wiki1' } as MenuItem;
    expect(component.canEditName(homeItem)).toBe(false);
  });

  it('should return false for canEditName when user cannot edit', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.componentRef.setInput('canEdit', false);
    fixture.detectChanges();

    const nonHomeItem = { id: 'wiki2' } as MenuItem;
    expect(component.canEditName(nonHomeItem)).toBe(false);
  });

  it('should compute wikiMenu with main wikis', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    const menu = component.wikiMenu();

    expect(menu.length).toBe(1);
    expect(menu[0].label).toBe('project.wiki.list.header');
    expect(menu[0].items?.length).toBe(3);
  });

  it('should compute wikiMenu with components wikis when present', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', mockComponentsList);
    fixture.detectChanges();

    const menu = component.wikiMenu();

    expect(menu.length).toBe(2);
    expect(menu[1].label).toBe('project.wiki.list.componentsHeader');
    expect(menu[1].items?.length).toBe(2);
  });

  it('should open delete confirmation dialog when openDeleteWikiDialog is called', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    component.openDeleteWikiDialog();

    expect(mockCustomConfirmationService.confirmDelete).toHaveBeenCalled();
  });

  it('should emit deleteWiki when delete is confirmed', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.deleteWiki, 'emit');

    component.openDeleteWikiDialog();

    const confirmDeleteCall = mockCustomConfirmationService.confirmDelete.mock.calls[0][0];
    confirmDeleteCall.onConfirm();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should toggle expanded state when collapseNavigation is called', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.expanded()).toBe(true);

    component.collapseNavigation();

    expect(component.expanded()).toBe(false);

    component.collapseNavigation();

    expect(component.expanded()).toBe(true);
  });

  it('should handle empty wiki list', () => {
    setup();
    fixture.componentRef.setInput('list', []);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', '');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    const menu = component.wikiMenu();

    expect(menu.length).toBe(1);
    expect(menu[0].items?.length).toBe(0);
  });

  it('should handle empty components list', () => {
    setup();
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.hasComponentsWikis()).toBe(false);

    const menu = component.wikiMenu();
    expect(menu.length).toBe(1);
  });

  it('should compute disabledButtonTooltip when wiki is read-only', () => {
    const selectorOverrides: SignalOverride[] = [
      {
        selector: UserSelectors.isProjectReadOnly,
        value: true,
      },
    ];
    setup({ selectorOverrides });
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.disabledButtonTooltip()).toBe('common.errorMessages.actionUnavailable');
  });
});
