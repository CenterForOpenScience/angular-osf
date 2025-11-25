import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { MarkdownComponent } from '@osf/shared/components/markdown/markdown.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { WikiSelectors } from '@osf/shared/stores/wiki';

import { OverviewWikiComponent } from './overview-wiki.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('OverviewWikiComponent', () => {
  let component: OverviewWikiComponent;
  let fixture: ComponentFixture<OverviewWikiComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;

  const mockResourceId = 'project-123';

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [OverviewWikiComponent, OSFTestingModule, ...MockComponents(TruncatedTextComponent, MarkdownComponent)],
      providers: [
        provideMockStore({
          signals: [
            { selector: WikiSelectors.getHomeWikiLoading, value: false },
            { selector: WikiSelectors.getHomeWikiContent, value: null },
          ],
        }),
        MockProvider(Router, routerMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewWikiComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default resourceId to empty string', () => {
    fixture.detectChanges();
    expect(component.resourceId()).toBe('');
  });

  it('should set resourceId input correctly', () => {
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.detectChanges();

    expect(component.resourceId()).toBe(mockResourceId);
  });

  it('should default canEdit to false', () => {
    fixture.detectChanges();
    expect(component.canEdit()).toBe(false);
  });

  it('should set canEdit input correctly', () => {
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();

    expect(component.canEdit()).toBe(true);
  });

  it('should get isWikiLoading from store', () => {
    fixture.detectChanges();
    expect(component.isWikiLoading).toBeDefined();
  });

  it('should get wikiContent from store', () => {
    fixture.detectChanges();
    expect(component.wikiContent).toBeDefined();
  });

  it('should compute wiki link with resourceId', () => {
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.detectChanges();

    expect(component.wikiLink()).toEqual(['/', mockResourceId, 'wiki']);
  });

  it('should compute wiki link with empty resourceId', () => {
    fixture.detectChanges();

    expect(component.wikiLink()).toEqual(['/', '', 'wiki']);
  });

  it('should navigate to wiki link', () => {
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.detectChanges();

    component.navigateToWiki();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/', mockResourceId, 'wiki']);
  });

  it('should navigate with empty resourceId', () => {
    fixture.detectChanges();

    component.navigateToWiki();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/', '', 'wiki']);
  });
});
