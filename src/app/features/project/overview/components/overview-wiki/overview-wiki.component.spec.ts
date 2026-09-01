import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { MarkdownComponent } from '@osf/shared/components/markdown/markdown.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { WikiSelectors } from '@osf/shared/stores/wiki';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

import { OverviewWikiComponent } from './overview-wiki.component';

describe('OverviewWikiComponent', () => {
  let component: OverviewWikiComponent;
  let fixture: ComponentFixture<OverviewWikiComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;

  const mockResourceId = 'project-123';

  function setup(signalOverrides?: SignalOverride[]) {
    routerMock = RouterMockBuilder.create().build();
    const defaultSignals = [
      { selector: WikiSelectors.getHomeWikiLoading, value: false },
      { selector: WikiSelectors.getHomeWikiContent, value: null },
      { selector: UserSelectors.isProjectReadOnly, value: false },
    ];
    const signals = mergeSignalOverrides(defaultSignals, signalOverrides);

    TestBed.configureTestingModule({
      imports: [OverviewWikiComponent, ...MockComponents(TruncatedTextComponent, MarkdownComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: signals,
        }),
        MockProvider(Router, routerMock),
      ],
    });

    fixture = TestBed.createComponent(OverviewWikiComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should default resourceId to empty string', () => {
    setup();
    fixture.detectChanges();
    expect(component.resourceId()).toBe('');
  });

  it('should set resourceId input correctly', () => {
    setup();
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.detectChanges();

    expect(component.resourceId()).toBe(mockResourceId);
  });

  it('should default canEdit to false', () => {
    setup();
    fixture.detectChanges();
    expect(component.canEdit()).toBe(false);
  });

  it('should set canEdit input correctly', () => {
    setup();
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();

    expect(component.canEdit()).toBe(true);
  });

  it('should get isWikiLoading from store', () => {
    setup();
    fixture.detectChanges();
    expect(component.isWikiLoading).toBeDefined();
  });

  it('should get wikiContent from store', () => {
    setup();
    fixture.detectChanges();
    expect(component.wikiContent).toBeDefined();
  });

  it('should compute wiki link with resourceId', () => {
    setup();
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.detectChanges();

    expect(component.wikiLink()).toEqual(['/', mockResourceId, 'wiki']);
  });

  it('should compute wiki link with empty resourceId', () => {
    setup();
    fixture.detectChanges();

    expect(component.wikiLink()).toEqual(['/', '', 'wiki']);
  });

  it('should navigate to wiki link', () => {
    setup();
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.detectChanges();

    component.navigateToWiki();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/', mockResourceId, 'wiki']);
  });

  it('should navigate with empty resourceId', () => {
    setup();
    fixture.detectChanges();

    component.navigateToWiki();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/', '', 'wiki']);
  });

  it('should compute disabledButtonTooltip based on isProjectReadOnly', () => {
    setup([{ selector: UserSelectors.isProjectReadOnly, value: true }]);
    fixture.detectChanges();
    expect(component.disabledButtonTooltip()).toBe('common.errorMessages.actionUnavailable');

    setup([{ selector: UserSelectors.isProjectReadOnly, value: false }]);
    fixture.detectChanges();
    expect(component.disabledButtonTooltip()).toBe('');
  });
});
