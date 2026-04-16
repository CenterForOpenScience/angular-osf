import { MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { WikiSyntaxHelpDialogComponent } from './wiki-syntax-help-dialog.component';

describe('WikiSyntaxHelpDialogComponent', () => {
  let component: WikiSyntaxHelpDialogComponent;
  let fixture: ComponentFixture<WikiSyntaxHelpDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WikiSyntaxHelpDialogComponent],
      providers: [provideOSFCore(), MockProvider(DynamicDialogRef)],
    });

    fixture = TestBed.createComponent(WikiSyntaxHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog when close button is clicked', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = vi.spyOn(dialogRef, 'close');

    dialogRef.close();

    expect(closeSpy).toHaveBeenCalled();
  });
});
