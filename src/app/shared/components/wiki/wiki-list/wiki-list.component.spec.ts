import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ComponentWiki, WikiModel } from '@shared/models/wiki/wiki.model';
import { WikiItemType } from '@shared/models/wiki/wiki-type.model';

import { WikiListComponent } from './wiki-list.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { DialogServiceMockBuilder } from '@testing/providers/dialog-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

describe('WikiListComponent', () => {
  let component: WikiListComponent;
  let fixture: ComponentFixture<WikiListComponent>;
  let mockCustomDialogService: ReturnType<DialogServiceMockBuilder['build']>;
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

  beforeEach(async () => {
    mockCustomDialogService = DialogServiceMockBuilder.create().withOpenMock().build();
    mockCustomConfirmationService = CustomConfirmationServiceMockBuilder.create().build();
    mockRouter = RouterMockBuilder.create().withUrl('/project/abc123/wiki').build();

    await TestBed.configureTestingModule({
      imports: [WikiListComponent, OSFTestingModule],
      providers: [
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(CustomConfirmationService, mockCustomConfirmationService),
        MockProvider(Router, mockRouter),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WikiListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have all required inputs', () => {
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
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.canEdit()).toBe(false);
  });

  it('should have WikiItemType enum available', () => {
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.wikiItemType).toBe(WikiItemType);
  });

  it('should have expanded signal initialized to true', () => {
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.expanded()).toBe(true);
  });

  it('should compute hasComponentsWikis correctly', () => {
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', mockComponentsList);
    fixture.detectChanges();

    expect(component.hasComponentsWikis()).toBe(true);
  });

  it('should compute hasComponentsWikis as false when empty', () => {
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.hasComponentsWikis()).toBe(false);
  });

  it('should compute isHomeWikiSelected correctly when home wiki is selected', () => {
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.isHomeWikiSelected()).toBe(true);
  });

  it('should compute isHomeWikiSelected as false when other wiki is selected', () => {
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki2');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.isHomeWikiSelected()).toBe(false);
  });

  it('should compute wikiMenu with main wikis', () => {
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
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    component.openDeleteWikiDialog();

    expect(mockCustomConfirmationService.confirmDelete).toHaveBeenCalled();
  });

  it('should emit deleteWiki when delete is confirmed', () => {
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.deleteWiki, 'emit');

    component.openDeleteWikiDialog();

    const confirmDeleteCall = mockCustomConfirmationService.confirmDelete.mock.calls[0][0];
    confirmDeleteCall.onConfirm();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should toggle expanded state when collapseNavigation is called', () => {
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
    fixture.componentRef.setInput('list', mockWikiList);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('currentWikiId', 'wiki1');
    fixture.componentRef.setInput('componentsList', []);
    fixture.detectChanges();

    expect(component.hasComponentsWikis()).toBe(false);

    const menu = component.wikiMenu();
    expect(menu.length).toBe(1);
  });
});
