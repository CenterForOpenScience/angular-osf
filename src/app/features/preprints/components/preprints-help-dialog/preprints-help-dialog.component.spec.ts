import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsHelpDialogComponent } from './preprints-help-dialog.component';

describe('PreprintsHelpDialogComponent', () => {
  let component: PreprintsHelpDialogComponent;
  let fixture: ComponentFixture<PreprintsHelpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsHelpDialogComponent, MockPipe(TranslatePipe)],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
