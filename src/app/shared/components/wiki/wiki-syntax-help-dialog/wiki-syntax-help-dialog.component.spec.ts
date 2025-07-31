import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiSyntaxHelpDialogComponent } from './wiki-syntax-help-dialog.component';

describe('WikiSyntaxHelpDialogComponent', () => {
  let component: WikiSyntaxHelpDialogComponent;
  let fixture: ComponentFixture<WikiSyntaxHelpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WikiSyntaxHelpDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WikiSyntaxHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
