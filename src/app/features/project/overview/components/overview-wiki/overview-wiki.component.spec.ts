import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownComponent } from '@osf/shared/components/markdown/markdown.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';

import { OverviewWikiComponent } from './overview-wiki.component';

describe('ProjectWikiComponent', () => {
  let component: OverviewWikiComponent;
  let fixture: ComponentFixture<OverviewWikiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewWikiComponent, ...MockComponents(TruncatedTextComponent, MarkdownComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
