import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';

import { LinkResourceDialogComponent } from './link-resource-dialog.component';

describe.skip('LinkProjectDialogComponent', () => {
  let component: LinkResourceDialogComponent;
  let fixture: ComponentFixture<LinkResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkResourceDialogComponent, ...MockComponents(SearchInputComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
